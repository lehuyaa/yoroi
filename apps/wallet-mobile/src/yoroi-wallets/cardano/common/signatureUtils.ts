import {SignTransactionRequest} from '@cardano-foundation/ledgerjs-hw-app-cardano'
import * as CSL_TYPES from '@emurgo/cross-csl-core'
import {Bip32PublicKey, PrivateKey} from '@emurgo/cross-csl-core'
import {Addressing, createLedgerPlutusPayload} from '@emurgo/yoroi-lib'
import blake2b from 'blake2b'
import {Buffer} from 'buffer'
import _ from 'lodash'

import {RawUtxo} from '../../types'
import {CardanoMobile} from '../../wallets'
import {HARD_DERIVATION_START} from '../constants/common'
import {NUMBERS} from '../numbers'
import {YoroiWallet} from '../types'
import {isHaskellShelley} from '../utils'

export const signRawTransaction = async (cbor: string, pKeys: PrivateKey[]): Promise<Uint8Array> => {
  const fixedTx = await CardanoMobile.FixedTransaction.fromHex(cbor)
  if (!fixedTx) throw new Error('invalid tx hex')
  const rawBody = await fixedTx.rawBody()
  const txHash = await CardanoMobile.TransactionHash.fromBytes(blake2b(32).update(rawBody).digest('binary'))
  if (!txHash) throw new Error('invalid tx hex, could not generate tx hash')

  const witSet = await fixedTx.witnessSet()
  const vkeys = await CardanoMobile.Vkeywitnesses.new()

  for (let i = 0; i < pKeys.length; i++) {
    const vkeyWit = await CardanoMobile.makeVkeyWitness(txHash, pKeys[i])
    if (!vkeyWit) throw new Error('invalid tx hex, could not generate vkey witness')
    await vkeys.add(vkeyWit)
  }

  await witSet.setVkeys(vkeys)
  await fixedTx.setWitnessSet(await witSet.toBytes())

  return fixedTx.toBytes()
}

export const createSignedLedgerSwapCancellationTx = async (
  cbor: string,
  witnesses: Array<{path: number[]; witnessSignatureHex: string}>,
  purpose: number,
  publicKeyHex: string,
): Promise<Uint8Array> => {
  const fixedBodyCbor = await getMuesliSwapFixedCbor(cbor)
  const fixedTx = await CardanoMobile.FixedTransaction.fromHex(fixedBodyCbor)
  if (!fixedTx) throw new Error('invalid tx hex')
  const rawBody = await fixedTx.rawBody()
  const txHash = await CardanoMobile.TransactionHash.fromBytes(blake2b(32).update(rawBody).digest('binary'))
  if (!txHash) throw new Error('invalid tx hex, could not generate tx hash')

  const witSet = await fixedTx.witnessSet()
  const vkeys = await CardanoMobile.Vkeywitnesses.new()

  const addressing = {
    path: [
      purpose,
      2147485463, // CARDANO
      2147483648,
    ],
    startLevel: 1,
  }

  const key = await CardanoMobile.Bip32PublicKey.fromBytes(Buffer.from(publicKeyHex, 'hex'))
  const keyLevel = addressing.startLevel + addressing.path.length - 1

  for (let i = 0; i < witnesses.length; i++) {
    const addressKey = await derivePublicByAddressing(
      {startLevel: 1, path: witnesses[i].path},
      {
        level: keyLevel,
        key,
      },
    )
    const witness = await CardanoMobile.Vkeywitness.new(
      await CardanoMobile.Vkey.new(await addressKey.toRawKey()),
      await CardanoMobile.Ed25519Signature.fromBytes(Buffer.from(witnesses[i].witnessSignatureHex, 'hex')),
    )
    if (!witness) throw new Error('invalid tx hex, could not generate vkey witness')
    await vkeys.add(witness)
  }

  await witSet.setVkeys(vkeys)
  await fixedTx.setWitnessSet(await witSet.toBytes())

  return fixedTx.toBytes()
}

export const derivePublicByAddressing = async (
  addressing: Addressing,
  startingFrom: {
    key: Bip32PublicKey
    level: number
  },
) => {
  if (startingFrom.level + 1 < addressing.startLevel) {
    throw new Error('derivePublicByAddressing: keyLevel < startLevel')
  }

  let derivedKey = startingFrom.key

  for (let i = startingFrom.level - addressing.startLevel + 1; i < addressing.path.length; i++) {
    derivedKey = await derivedKey.derive(addressing.path[i])
  }

  return derivedKey
}

export const createSwapCancellationLedgerPayload = async (
  cbor: string,
  wallet: YoroiWallet,
  networkId: number,
  protocolMagic: number,
  getAddressing: (address: string) => Addressing,
  stakeVKHash: CSL_TYPES.Ed25519KeyHash,
): Promise<SignTransactionRequest> => {
  const changeAddrs = [...wallet.internalAddresses, ...wallet.internalAddresses].map((address) => ({
    addressing: getAddressing(address),
    address,
  }))
  const getAddressingByTxIdAndIndex = (txId: string, index: number) => {
    const utxo = wallet.allUtxos.find((utxo) => utxo.tx_hash === txId && utxo.tx_index === index)
    return utxo ? getAddressing(utxo.receiver) : null
  }
  return createLedgerPlutusPayload({
    wasm: CardanoMobile,
    cbor: await getMuesliSwapFixedCbor(cbor),
    addresses: changeAddrs,
    networkId,
    protocolMagic,
    purpose: harden(1852),
    stakeVKHash,
    getUtxoAddressing: getAddressingByTxIdAndIndex,
    getAddressAddressing: getAddressing,
  })
}

export const convertBech32ToHex = async (bech32Address: string) => {
  const address = await CardanoMobile.Address.fromBech32(bech32Address)
  const bytes = await address.toBytes()
  return new Buffer(bytes).toString('hex')
}

export const harden = (num: number) => HARD_DERIVATION_START + num

export const getCostModel = async () => {
  const babbageCostModels = await CardanoMobile.Costmdls.new()
  const v1CostModel = await CardanoMobile.CostModel.new()
  await Promise.all(
    operations1.map(async (cost, operation) => v1CostModel.set(operation, await CardanoMobile.Int.newI32(cost))),
  )

  const v2CostModel = await CardanoMobile.CostModel.new()
  await Promise.all(
    operations2.map(async (cost, operation) => v2CostModel.set(operation, await CardanoMobile.Int.newI32(cost))),
  )

  await babbageCostModels.insert(await CardanoMobile.Language.newPlutusV1(), v1CostModel)
  await babbageCostModels.insert(await CardanoMobile.Language.newPlutusV2(), v2CostModel)

  return babbageCostModels
}

const bigNumFromStr = async (str: string) => {
  const bigNum = await CardanoMobile.BigNum.fromStr(str)
  if (!bigNum) throw new Error('Could not parse big number from string ' + str)
  return bigNum
}

export const getTransactionBuilder = async () => {
  const linearFee = await CardanoMobile.LinearFee.new(await bigNumFromStr('44'), await bigNumFromStr('155381'))

  const exUnitPrices = await CardanoMobile.ExUnitPrices.new(
    await CardanoMobile.UnitInterval.new(await bigNumFromStr('577'), await bigNumFromStr('10000')),
    await CardanoMobile.UnitInterval.new(await bigNumFromStr('721'), await bigNumFromStr('10000000')),
  )

  const txBuilderCfg = await CardanoMobile.TransactionBuilderConfigBuilder.new()
    .then((builder) => builder.feeAlgo(linearFee))
    .then(async (builder) => builder.poolDeposit(await bigNumFromStr('500000000')))
    .then(async (builder) => builder.keyDeposit(await bigNumFromStr('2000000')))
    .then((builder) => builder.maxValueSize(4000))
    .then((builder) => builder.maxTxSize(8000))
    .then(async (builder) => builder.coinsPerUtxoWord(await bigNumFromStr('34482')))
    .then(async (builder) => builder.exUnitPrices(exUnitPrices).then((builder) => builder.build()))

  return CardanoMobile.TransactionBuilder.new(assertRequired(txBuilderCfg, 'Could not build transaction builder'))
}

const operations1 = Object.values({
  'addInteger-cpu-arguments-intercept': 205665,
  'addInteger-cpu-arguments-slope': 812,
  'addInteger-memory-arguments-intercept': 1,
  'addInteger-memory-arguments-slope': 1,
  'appendByteString-cpu-arguments-intercept': 1000,
  'appendByteString-cpu-arguments-slope': 571,
  'appendByteString-memory-arguments-intercept': 0,
  'appendByteString-memory-arguments-slope': 1,
  'appendString-cpu-arguments-intercept': 1000,
  'appendString-cpu-arguments-slope': 24177,
  'appendString-memory-arguments-intercept': 4,
  'appendString-memory-arguments-slope': 1,
  'bData-cpu-arguments': 1000,
  'bData-memory-arguments': 32,
  'blake2b_256-cpu-arguments-intercept': 117366,
  'blake2b_256-cpu-arguments-slope': 10475,
  'blake2b_256-memory-arguments': 4,
  'cekApplyCost-exBudgetCPU': 23000,
  'cekApplyCost-exBudgetMemory': 100,
  'cekBuiltinCost-exBudgetCPU': 23000,
  'cekBuiltinCost-exBudgetMemory': 100,
  'cekConstCost-exBudgetCPU': 23000,
  'cekConstCost-exBudgetMemory': 100,
  'cekDelayCost-exBudgetCPU': 23000,
  'cekDelayCost-exBudgetMemory': 100,
  'cekForceCost-exBudgetCPU': 23000,
  'cekForceCost-exBudgetMemory': 100,
  'cekLamCost-exBudgetCPU': 23000,
  'cekLamCost-exBudgetMemory': 100,
  'cekStartupCost-exBudgetCPU': 100,
  'cekStartupCost-exBudgetMemory': 100,
  'cekVarCost-exBudgetCPU': 23000,
  'cekVarCost-exBudgetMemory': 100,
  'chooseData-cpu-arguments': 19537,
  'chooseData-memory-arguments': 32,
  'chooseList-cpu-arguments': 175354,
  'chooseList-memory-arguments': 32,
  'chooseUnit-cpu-arguments': 46417,
  'chooseUnit-memory-arguments': 4,
  'consByteString-cpu-arguments-intercept': 221973,
  'consByteString-cpu-arguments-slope': 511,
  'consByteString-memory-arguments-intercept': 0,
  'consByteString-memory-arguments-slope': 1,
  'constrData-cpu-arguments': 89141,
  'constrData-memory-arguments': 32,
  'decodeUtf8-cpu-arguments-intercept': 497525,
  'decodeUtf8-cpu-arguments-slope': 14068,
  'decodeUtf8-memory-arguments-intercept': 4,
  'decodeUtf8-memory-arguments-slope': 2,
  'divideInteger-cpu-arguments-constant': 196500,
  'divideInteger-cpu-arguments-model-arguments-intercept': 453240,
  'divideInteger-cpu-arguments-model-arguments-slope': 220,
  'divideInteger-memory-arguments-intercept': 0,
  'divideInteger-memory-arguments-minimum': 1,
  'divideInteger-memory-arguments-slope': 1,
  'encodeUtf8-cpu-arguments-intercept': 1000,
  'encodeUtf8-cpu-arguments-slope': 28662,
  'encodeUtf8-memory-arguments-intercept': 4,
  'encodeUtf8-memory-arguments-slope': 2,
  'equalsByteString-cpu-arguments-constant': 245000,
  'equalsByteString-cpu-arguments-intercept': 216773,
  'equalsByteString-cpu-arguments-slope': 62,
  'equalsByteString-memory-arguments': 1,
  'equalsData-cpu-arguments-intercept': 1060367,
  'equalsData-cpu-arguments-slope': 12586,
  'equalsData-memory-arguments': 1,
  'equalsInteger-cpu-arguments-intercept': 208512,
  'equalsInteger-cpu-arguments-slope': 421,
  'equalsInteger-memory-arguments': 1,
  'equalsString-cpu-arguments-constant': 187000,
  'equalsString-cpu-arguments-intercept': 1000,
  'equalsString-cpu-arguments-slope': 52998,
  'equalsString-memory-arguments': 1,
  'fstPair-cpu-arguments': 80436,
  'fstPair-memory-arguments': 32,
  'headList-cpu-arguments': 43249,
  'headList-memory-arguments': 32,
  'iData-cpu-arguments': 1000,
  'iData-memory-arguments': 32,
  'ifThenElse-cpu-arguments': 80556,
  'ifThenElse-memory-arguments': 1,
  'indexByteString-cpu-arguments': 57667,
  'indexByteString-memory-arguments': 4,
  'lengthOfByteString-cpu-arguments': 1000,
  'lengthOfByteString-memory-arguments': 10,
  'lessThanByteString-cpu-arguments-intercept': 197145,
  'lessThanByteString-cpu-arguments-slope': 156,
  'lessThanByteString-memory-arguments': 1,
  'lessThanEqualsByteString-cpu-arguments-intercept': 197145,
  'lessThanEqualsByteString-cpu-arguments-slope': 156,
  'lessThanEqualsByteString-memory-arguments': 1,
  'lessThanEqualsInteger-cpu-arguments-intercept': 204924,
  'lessThanEqualsInteger-cpu-arguments-slope': 473,
  'lessThanEqualsInteger-memory-arguments': 1,
  'lessThanInteger-cpu-arguments-intercept': 208896,
  'lessThanInteger-cpu-arguments-slope': 511,
  'lessThanInteger-memory-arguments': 1,
  'listData-cpu-arguments': 52467,
  'listData-memory-arguments': 32,
  'mapData-cpu-arguments': 64832,
  'mapData-memory-arguments': 32,
  'mkCons-cpu-arguments': 65493,
  'mkCons-memory-arguments': 32,
  'mkNilData-cpu-arguments': 22558,
  'mkNilData-memory-arguments': 32,
  'mkNilPairData-cpu-arguments': 16563,
  'mkNilPairData-memory-arguments': 32,
  'mkPairData-cpu-arguments': 76511,
  'mkPairData-memory-arguments': 32,
  'modInteger-cpu-arguments-constant': 196500,
  'modInteger-cpu-arguments-model-arguments-intercept': 453240,
  'modInteger-cpu-arguments-model-arguments-slope': 220,
  'modInteger-memory-arguments-intercept': 0,
  'modInteger-memory-arguments-minimum': 1,
  'modInteger-memory-arguments-slope': 1,
  'multiplyInteger-cpu-arguments-intercept': 69522,
  'multiplyInteger-cpu-arguments-slope': 11687,
  'multiplyInteger-memory-arguments-intercept': 0,
  'multiplyInteger-memory-arguments-slope': 1,
  'nullList-cpu-arguments': 60091,
  'nullList-memory-arguments': 32,
  'quotientInteger-cpu-arguments-constant': 196500,
  'quotientInteger-cpu-arguments-model-arguments-intercept': 453240,
  'quotientInteger-cpu-arguments-model-arguments-slope': 220,
  'quotientInteger-memory-arguments-intercept': 0,
  'quotientInteger-memory-arguments-minimum': 1,
  'quotientInteger-memory-arguments-slope': 1,
  'remainderInteger-cpu-arguments-constant': 196500,
  'remainderInteger-cpu-arguments-model-arguments-intercept': 453240,
  'remainderInteger-cpu-arguments-model-arguments-slope': 220,
  'remainderInteger-memory-arguments-intercept': 0,
  'remainderInteger-memory-arguments-minimum': 1,
  'remainderInteger-memory-arguments-slope': 1,
  'sha2_256-cpu-arguments-intercept': 806990,
  'sha2_256-cpu-arguments-slope': 30482,
  'sha2_256-memory-arguments': 4,
  'sha3_256-cpu-arguments-intercept': 1927926,
  'sha3_256-cpu-arguments-slope': 82523,
  'sha3_256-memory-arguments': 4,
  'sliceByteString-cpu-arguments-intercept': 265318,
  'sliceByteString-cpu-arguments-slope': 0,
  'sliceByteString-memory-arguments-intercept': 4,
  'sliceByteString-memory-arguments-slope': 0,
  'sndPair-cpu-arguments': 85931,
  'sndPair-memory-arguments': 32,
  'subtractInteger-cpu-arguments-intercept': 205665,
  'subtractInteger-cpu-arguments-slope': 812,
  'subtractInteger-memory-arguments-intercept': 1,
  'subtractInteger-memory-arguments-slope': 1,
  'tailList-cpu-arguments': 41182,
  'tailList-memory-arguments': 32,
  'trace-cpu-arguments': 212342,
  'trace-memory-arguments': 32,
  'unBData-cpu-arguments': 31220,
  'unBData-memory-arguments': 32,
  'unConstrData-cpu-arguments': 32696,
  'unConstrData-memory-arguments': 32,
  'unIData-cpu-arguments': 43357,
  'unIData-memory-arguments': 32,
  'unListData-cpu-arguments': 32247,
  'unListData-memory-arguments': 32,
  'unMapData-cpu-arguments': 38314,
  'unMapData-memory-arguments': 32,
  'verifyEd25519Signature-cpu-arguments-intercept': 57996947,
  'verifyEd25519Signature-cpu-arguments-slope': 18975,
  'verifyEd25519Signature-memory-arguments': 10,
})

const operations2 = Object.values({
  'addInteger-cpu-arguments-intercept': 205665,
  'addInteger-cpu-arguments-slope': 812,
  'addInteger-memory-arguments-intercept': 1,
  'addInteger-memory-arguments-slope': 1,
  'appendByteString-cpu-arguments-intercept': 1000,
  'appendByteString-cpu-arguments-slope': 571,
  'appendByteString-memory-arguments-intercept': 0,
  'appendByteString-memory-arguments-slope': 1,
  'appendString-cpu-arguments-intercept': 1000,
  'appendString-cpu-arguments-slope': 24177,
  'appendString-memory-arguments-intercept': 4,
  'appendString-memory-arguments-slope': 1,
  'bData-cpu-arguments': 1000,
  'bData-memory-arguments': 32,
  'blake2b_256-cpu-arguments-intercept': 117366,
  'blake2b_256-cpu-arguments-slope': 10475,
  'blake2b_256-memory-arguments': 4,
  'cekApplyCost-exBudgetCPU': 23000,
  'cekApplyCost-exBudgetMemory': 100,
  'cekBuiltinCost-exBudgetCPU': 23000,
  'cekBuiltinCost-exBudgetMemory': 100,
  'cekConstCost-exBudgetCPU': 23000,
  'cekConstCost-exBudgetMemory': 100,
  'cekDelayCost-exBudgetCPU': 23000,
  'cekDelayCost-exBudgetMemory': 100,
  'cekForceCost-exBudgetCPU': 23000,
  'cekForceCost-exBudgetMemory': 100,
  'cekLamCost-exBudgetCPU': 23000,
  'cekLamCost-exBudgetMemory': 100,
  'cekStartupCost-exBudgetCPU': 100,
  'cekStartupCost-exBudgetMemory': 100,
  'cekVarCost-exBudgetCPU': 23000,
  'cekVarCost-exBudgetMemory': 100,
  'chooseData-cpu-arguments': 19537,
  'chooseData-memory-arguments': 32,
  'chooseList-cpu-arguments': 175354,
  'chooseList-memory-arguments': 32,
  'chooseUnit-cpu-arguments': 46417,
  'chooseUnit-memory-arguments': 4,
  'consByteString-cpu-arguments-intercept': 221973,
  'consByteString-cpu-arguments-slope': 511,
  'consByteString-memory-arguments-intercept': 0,
  'consByteString-memory-arguments-slope': 1,
  'constrData-cpu-arguments': 89141,
  'constrData-memory-arguments': 32,
  'decodeUtf8-cpu-arguments-intercept': 497525,
  'decodeUtf8-cpu-arguments-slope': 14068,
  'decodeUtf8-memory-arguments-intercept': 4,
  'decodeUtf8-memory-arguments-slope': 2,
  'divideInteger-cpu-arguments-constant': 196500,
  'divideInteger-cpu-arguments-model-arguments-intercept': 453240,
  'divideInteger-cpu-arguments-model-arguments-slope': 220,
  'divideInteger-memory-arguments-intercept': 0,
  'divideInteger-memory-arguments-minimum': 1,
  'divideInteger-memory-arguments-slope': 1,
  'encodeUtf8-cpu-arguments-intercept': 1000,
  'encodeUtf8-cpu-arguments-slope': 28662,
  'encodeUtf8-memory-arguments-intercept': 4,
  'encodeUtf8-memory-arguments-slope': 2,
  'equalsByteString-cpu-arguments-constant': 245000,
  'equalsByteString-cpu-arguments-intercept': 216773,
  'equalsByteString-cpu-arguments-slope': 62,
  'equalsByteString-memory-arguments': 1,
  'equalsData-cpu-arguments-intercept': 1060367,
  'equalsData-cpu-arguments-slope': 12586,
  'equalsData-memory-arguments': 1,
  'equalsInteger-cpu-arguments-intercept': 208512,
  'equalsInteger-cpu-arguments-slope': 421,
  'equalsInteger-memory-arguments': 1,
  'equalsString-cpu-arguments-constant': 187000,
  'equalsString-cpu-arguments-intercept': 1000,
  'equalsString-cpu-arguments-slope': 52998,
  'equalsString-memory-arguments': 1,
  'fstPair-cpu-arguments': 80436,
  'fstPair-memory-arguments': 32,
  'headList-cpu-arguments': 43249,
  'headList-memory-arguments': 32,
  'iData-cpu-arguments': 1000,
  'iData-memory-arguments': 32,
  'ifThenElse-cpu-arguments': 80556,
  'ifThenElse-memory-arguments': 1,
  'indexByteString-cpu-arguments': 57667,
  'indexByteString-memory-arguments': 4,
  'lengthOfByteString-cpu-arguments': 1000,
  'lengthOfByteString-memory-arguments': 10,
  'lessThanByteString-cpu-arguments-intercept': 197145,
  'lessThanByteString-cpu-arguments-slope': 156,
  'lessThanByteString-memory-arguments': 1,
  'lessThanEqualsByteString-cpu-arguments-intercept': 197145,
  'lessThanEqualsByteString-cpu-arguments-slope': 156,
  'lessThanEqualsByteString-memory-arguments': 1,
  'lessThanEqualsInteger-cpu-arguments-intercept': 204924,
  'lessThanEqualsInteger-cpu-arguments-slope': 473,
  'lessThanEqualsInteger-memory-arguments': 1,
  'lessThanInteger-cpu-arguments-intercept': 208896,
  'lessThanInteger-cpu-arguments-slope': 511,
  'lessThanInteger-memory-arguments': 1,
  'listData-cpu-arguments': 52467,
  'listData-memory-arguments': 32,
  'mapData-cpu-arguments': 64832,
  'mapData-memory-arguments': 32,
  'mkCons-cpu-arguments': 65493,
  'mkCons-memory-arguments': 32,
  'mkNilData-cpu-arguments': 22558,
  'mkNilData-memory-arguments': 32,
  'mkNilPairData-cpu-arguments': 16563,
  'mkNilPairData-memory-arguments': 32,
  'mkPairData-cpu-arguments': 76511,
  'mkPairData-memory-arguments': 32,
  'modInteger-cpu-arguments-constant': 196500,
  'modInteger-cpu-arguments-model-arguments-intercept': 453240,
  'modInteger-cpu-arguments-model-arguments-slope': 220,
  'modInteger-memory-arguments-intercept': 0,
  'modInteger-memory-arguments-minimum': 1,
  'modInteger-memory-arguments-slope': 1,
  'multiplyInteger-cpu-arguments-intercept': 69522,
  'multiplyInteger-cpu-arguments-slope': 11687,
  'multiplyInteger-memory-arguments-intercept': 0,
  'multiplyInteger-memory-arguments-slope': 1,
  'nullList-cpu-arguments': 60091,
  'nullList-memory-arguments': 32,
  'quotientInteger-cpu-arguments-constant': 196500,
  'quotientInteger-cpu-arguments-model-arguments-intercept': 453240,
  'quotientInteger-cpu-arguments-model-arguments-slope': 220,
  'quotientInteger-memory-arguments-intercept': 0,
  'quotientInteger-memory-arguments-minimum': 1,
  'quotientInteger-memory-arguments-slope': 1,
  'remainderInteger-cpu-arguments-constant': 196500,
  'remainderInteger-cpu-arguments-model-arguments-intercept': 453240,
  'remainderInteger-cpu-arguments-model-arguments-slope': 220,
  'remainderInteger-memory-arguments-intercept': 0,
  'remainderInteger-memory-arguments-minimum': 1,
  'remainderInteger-memory-arguments-slope': 1,
  'serialiseData-cpu-arguments-intercept': 1159724,
  'serialiseData-cpu-arguments-slope': 392670,
  'serialiseData-memory-arguments-intercept': 0,
  'serialiseData-memory-arguments-slope': 2,
  'sha2_256-cpu-arguments-intercept': 806990,
  'sha2_256-cpu-arguments-slope': 30482,
  'sha2_256-memory-arguments': 4,
  'sha3_256-cpu-arguments-intercept': 1927926,
  'sha3_256-cpu-arguments-slope': 82523,
  'sha3_256-memory-arguments': 4,
  'sliceByteString-cpu-arguments-intercept': 265318,
  'sliceByteString-cpu-arguments-slope': 0,
  'sliceByteString-memory-arguments-intercept': 4,
  'sliceByteString-memory-arguments-slope': 0,
  'sndPair-cpu-arguments': 85931,
  'sndPair-memory-arguments': 32,
  'subtractInteger-cpu-arguments-intercept': 205665,
  'subtractInteger-cpu-arguments-slope': 812,
  'subtractInteger-memory-arguments-intercept': 1,
  'subtractInteger-memory-arguments-slope': 1,
  'tailList-cpu-arguments': 41182,
  'tailList-memory-arguments': 32,
  'trace-cpu-arguments': 212342,
  'trace-memory-arguments': 32,
  'unBData-cpu-arguments': 31220,
  'unBData-memory-arguments': 32,
  'unConstrData-cpu-arguments': 32696,
  'unConstrData-memory-arguments': 32,
  'unIData-cpu-arguments': 43357,
  'unIData-memory-arguments': 32,
  'unListData-cpu-arguments': 32247,
  'unListData-memory-arguments': 32,
  'unMapData-cpu-arguments': 38314,
  'unMapData-memory-arguments': 32,
  'verifyEcdsaSecp256k1Signature-cpu-arguments': 35892428,
  'verifyEcdsaSecp256k1Signature-memory-arguments': 10,
  'verifyEd25519Signature-cpu-arguments-intercept': 57996947,
  'verifyEd25519Signature-cpu-arguments-slope': 18975,
  'verifyEd25519Signature-memory-arguments': 10,
  'verifySchnorrSecp256k1Signature-cpu-arguments-intercept': 38887044,
  'verifySchnorrSecp256k1Signature-cpu-arguments-slope': 32947,
  'verifySchnorrSecp256k1Signature-memory-arguments': 10,
})

export const assertRequired = <T>(value: T | undefined, message: string): T => {
  if (value === undefined) throw new Error(message)
  return value
}

export const fixScriptHash = async (tx: CSL_TYPES.Transaction) => {
  const builder = await getTransactionBuilder()

  const witnessSet = await tx.witnessSet()

  const plutusScripts = assertRequired(await witnessSet.plutusScripts(), 'Transaction does not contain plutus scripts')
  const plutusData = assertRequired(await witnessSet.plutusData(), 'Transaction does not contain plutus data')
  const redeemers = assertRequired(await witnessSet.redeemers(), 'Transaction does not contain redeemers')
  const placeholderAddress = assertRequired(
    await CardanoMobile.Address.fromBech32(DUMMY_ADDRESS),
    'Could not parse placeholder address',
  )

  const input = await (await (await tx.body()).inputs()).get(0)
  const amount = await CardanoMobile.Value.new(await bigNumFromStr('5000000'))
  const script = await plutusScripts.get(0)
  const data = await plutusData.get(0)
  const redeemer = await redeemers.get(0)

  const plutusWitness = await CardanoMobile.PlutusWitness.new(script, data, redeemer)

  await builder.addPlutusScriptInput(plutusWitness, input, amount)

  await builder.calcScriptDataHash(await getCostModel())

  await builder.addChangeIfNeeded(placeholderAddress)

  const dummyTxForCalculatingScriptHash = assertRequired(
    await builder.build(),
    'Could not build placeholder transaction',
  )
  const correctScriptHash = assertRequired(
    await dummyTxForCalculatingScriptHash.scriptDataHash(),
    'Script hash is empty',
  )

  const body = await tx.body()
  await body.setScriptDataHash(correctScriptHash)
  return body
}

const DUMMY_ADDRESS =
  'addr1q9l0qrhrvu3nq92ns23g2atns690ge4c325vgzqlg4vru9uym9vrnx7vuq6q9lv984p6feekdusp3yewttl5a65sg6fs9r9gw5'

export const getRequiredSigners = async (tx: CSL_TYPES.Transaction, wallet: YoroiWallet) => {
  const utxos = wallet.allUtxos
  const body = await tx.body()
  const inputs = await body.inputs()
  const purpose = isHaskellShelley(wallet.walletImplementationId)
    ? NUMBERS.WALLET_TYPE_PURPOSE.CIP1852
    : NUMBERS.WALLET_TYPE_PURPOSE.BIP44
  const signers = [[purpose, harden(1815), harden(0), 0, 0]]

  const inputUtxos: RawUtxo[] = []

  for (let i = 0; i < (await inputs.len()); i++) {
    const input = await inputs.get(i)
    const txId = await input.transactionId().then((t) => t.toHex())
    const txIndex = await input.index()
    const matchingUtxo = utxos.find((utxo) => utxo.tx_hash === txId && utxo.tx_index === txIndex)
    if (!matchingUtxo) continue
    inputUtxos.push(matchingUtxo)
  }

  inputUtxos.forEach((utxo) => {
    signers.push(getDerivationPathForAddress(utxo.receiver, wallet, purpose))
  })

  const requiredSigners = assertRequired(await body.requiredSigners(), 'Transaction does not contain required signers')

  const txRequiredAddresses: string[] = []
  for (let i = 0; i < (await requiredSigners.len()); i++) {
    const signer = await requiredSigners.get(i)
    const hex = await signer.toHex()

    const allAddresses = [...wallet.externalAddresses, ...wallet.internalAddresses]
    await Promise.all(
      allAddresses.map(async (bech32Address) => {
        const parsedAddress = await CardanoMobile.Address.fromBech32(bech32Address)
        const baseAddr = await CardanoMobile.BaseAddress.fromAddress(parsedAddress)
        const paymentCred = await baseAddr.paymentCred()
        const keyHash = await paymentCred.toKeyhash()
        const hexKeyHash = await keyHash.toBytes().then((b) => Buffer.from(b).toString('hex'))
        if (hex === hexKeyHash) {
          txRequiredAddresses.push(bech32Address)
        }
      }),
    )
  }

  txRequiredAddresses.forEach((address) => {
    signers.push(getDerivationPathForAddress(address, wallet, purpose))
  })

  const collateralInputs = assertRequired(await body.collateral(), 'Transaction does not contain collateral inputs')

  const firstCollateral = await collateralInputs.get(0)
  const txId = await firstCollateral.transactionId().then((t) => t.toHex())
  const txIndex = await firstCollateral.index()

  const matchingUtxo = utxos.find((utxo) => utxo.tx_hash === txId && utxo.tx_index === txIndex)
  if (!matchingUtxo) throw new Error('Could not find matching utxo')

  const {receiver} = matchingUtxo
  signers.push(getDerivationPathForAddress(receiver, wallet, purpose))

  return getUniquePaths(signers)
}

const getUniquePaths = (paths: number[][]) => {
  return _.uniqWith(paths, arePathsEqual)
}

const arePathsEqual = (path1: number[], path2: number[]) => {
  return path1.every((value, index) => value === path2[index]) && path1.length === path2.length
}

const getDerivationPathForAddress = (address: string, wallet: YoroiWallet, purpose: number) => {
  const internalIndex = wallet.internalAddresses.indexOf(address)
  const externalIndex = wallet.externalAddresses.indexOf(address)
  if (internalIndex === -1 && externalIndex === -1) throw new Error('Could not find matching address')

  const role = internalIndex > -1 ? 1 : 0
  const index = Math.max(internalIndex, externalIndex)

  return [purpose, harden(1815), harden(0), role, index]
}

export const getMuesliSwapTransactionAndSigners = async (cbor: string, wallet: YoroiWallet) => {
  const newCbor = await getMuesliSwapFixedCbor(cbor)
  const tx = await CardanoMobile.Transaction.fromHex(newCbor)
  const signers = await getRequiredSigners(tx, wallet)
  return {cbor: newCbor, signers}
}

export const getMuesliSwapFixedCbor = async (cbor: string) => {
  const originalTx = assertRequired(
    await CardanoMobile.Transaction.fromHex(cbor),
    'Could not parse transaction from cbor',
  )
  const fixedTxBody = await fixScriptHash(originalTx)

  const txWithFixedBody = await CardanoMobile.Transaction.new(fixedTxBody, await originalTx.witnessSet(), undefined)
  return Buffer.from(await txWithFixedBody.toBytes()).toString('hex')
}
