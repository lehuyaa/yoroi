import AssetFingerprint from '@emurgo/cip14-js'
import {Swap, Balance} from '@yoroi/types'
import {OpenSwap} from '@yoroi/openswap'
import {isString} from '@yoroi/common'

import {Quantities} from '../utils/quantities'
import {supportedProviders} from '../translators/constants'
import {asQuantity} from '../utils/asQuantity'

export const transformersMaker = (
  primaryTokenId: Balance.Token['info']['id'],
) => {
  const asOpenswapTokenId = (yoroiTokenId: string) => {
    const [policyId, assetName = ''] = yoroiTokenId.split('.') as [
      string,
      string?,
    ]
    // we dont convert to '.' or 'lovelace' only ''
    return {
      policyId,
      assetName,
    }
  }

  const asOpenswapPriceTokenAddress = (yoroiTokenId: string) => {
    const [policyId, name = ''] = yoroiTokenId.split('.') as [string, string?]
    // we dont convert to '.' or 'lovelace' only ''
    return {
      policyId,
      name,
    }
  }

  const asYoroiTokenId = ({
    policyId,
    name,
  }: {
    policyId: string
    name: string
  }): Balance.Token['info']['id'] => {
    const possibleTokenId = `${policyId}.${name}`
    // openswap is inconsistent about ADA
    // sometimes is '.', '' or 'lovelace'
    const isPrimaryToken =
      possibleTokenId === '.' || possibleTokenId === 'lovelace.'
    if (policyId === '' || isPrimaryToken) return primaryTokenId
    return `${policyId}.${name}`
  }

  const asOpenswapAmount = (yoroiAmount: Balance.Amount) => {
    const {tokenId, quantity: amount} = yoroiAmount
    const {policyId, assetName} = asOpenswapTokenId(tokenId)
    return {
      amount,
      assetName,
      policyId,
    } as const
  }

  const asYoroiOpenOrder = (openswapOrder: OpenSwap.OpenOrder) => {
    const {from, to, deposit, ...rest} = openswapOrder
    const [policyId, name = ''] = primaryTokenId.split('.') as [string, string?]
    return {
      ...rest,
      from: asYoroiAmount(from),
      to: asYoroiAmount(to),
      deposit: asYoroiAmount({
        amount: deposit,
        address: {
          policyId,
          name,
        },
      }),
    } as const
  }

  const asYoroiCompletedOrder = (openswapOrder: OpenSwap.CompletedOrder) => {
    const {txHash, fromAmount, fromToken, toAmount, toToken} = openswapOrder
    const from = {
      amount: fromAmount,
      token: `${fromToken.address.policyId}.${fromToken.address.name}`,
    }
    const to = {
      amount: toAmount,
      token: `${toToken.address.policyId}.${toToken.address.name}`,
    }

    return {
      txHash: txHash,
      from: asYoroiAmount(from),
      to: asYoroiAmount(to),
    } as const
  }

  const asYoroiBalanceToken = (
    openswapTokenPair: OpenSwap.TokenPair,
  ): Balance.Token => {
    const {info, price} = openswapTokenPair
    const balanceToken: Balance.Token = {
      info: asYoroiBalanceTokenInfo(info),
      price: {
        ...price,
      },
      status: info.status,
      supply: {
        ...info.supply,
      },
    }
    return balanceToken
  }

  const asYoroiBalanceTokenInfo = (
    openswapToken: OpenSwap.TokenPair['info'],
  ): Balance.TokenInfo => {
    const tokenInfo: Balance.TokenInfo = {
      id: asYoroiTokenId(openswapToken.address),
      group: openswapToken.address.policyId,
      fingerprint: asTokenFingerprint({
        policyId: openswapToken.address.policyId,
        assetNameHex: openswapToken.address.name,
      }),
      name: asUtf8(openswapToken.address.name),
      decimals: openswapToken.decimalPlaces,
      description: openswapToken.description,
      image: openswapToken.image,
      kind: 'ft',
      icon: undefined,
      ticker: openswapToken.symbol,
      symbol: openswapToken.sign,
      metadatas: {},
    }
    return tokenInfo
  }

  const asYoroiBalanceTokenInfos = (
    openswapTokens: OpenSwap.ListTokensResponse,
  ): Balance.TokenInfo[] => {
    if (openswapTokens.length === 0) return []
    // filters should go into manager, but since we strip out the status is here for now
    return openswapTokens
      .filter((token) => token.status === 'verified')
      .map(asYoroiBalanceTokenInfo)
  }

  const asYoroiPool = (
    openswapLiquidityPool: OpenSwap.LiquidityPool,
  ): Swap.Pool | null => {
    const {
      batcherFee,
      poolFee,
      lvlDeposit,
      lpToken,
      tokenA,
      tokenB,
      provider,
      poolId,
    } = openswapLiquidityPool

    if (provider && !isSupportedProvider(provider)) return null

    const pool: Swap.Pool = {
      tokenA: asYoroiAmount(tokenA),
      tokenB: asYoroiAmount(tokenB),
      ptPriceTokenA: tokenA.priceAda.toString(),
      ptPriceTokenB: tokenB.priceAda.toString(),
      deposit: asYoroiAmount({amount: lvlDeposit, address: undefined}),
      lpToken: asYoroiAmount(lpToken),
      batcherFee: asYoroiAmount({amount: batcherFee, address: undefined}),
      fee: poolFee,
      poolId,
      provider,
    }
    return pool
  }

  const asYoroiAmount = (openswapAmount: {
    address?: {
      policyId: string
      name: string
    }
    // openswap is inconsistent about ADA
    // sometimes is '.', '' or 'lovelace'
    token?: string
    amount?: string
  }): Balance.Amount => {
    const {amount, address, token} = openswapAmount ?? {}

    let policyId = ''
    let name = ''

    if (address) {
      policyId = address.policyId
      name = address.name
    } else if (isString(token)) {
      const tokenParts = token.split('.') as [string, string?]
      policyId = tokenParts[0]
      name = tokenParts[1] ?? ''
    }

    const yoroiAmount: Balance.Amount = {
      quantity: asQuantity(amount ?? Quantities.zero),
      tokenId: asYoroiTokenId({policyId, name}),
    } as const

    return yoroiAmount
  }

  /**
   *  Filter out pools that are not supported by Yoroi
   *
   * @param openswapLiquidityPools
   * @returns {Swap.Pool[]}
   */
  const asYoroiPools = (
    openswapLiquidityPools: OpenSwap.LiquidityPool[],
  ): Swap.Pool[] => {
    if (openswapLiquidityPools?.length > 0)
      return openswapLiquidityPools
        .map(asYoroiPool)
        .filter((pool): pool is Swap.Pool => pool !== null)

    return []
  }

  const asYoroiBalanceTokens = (
    openswapTokenPairs: OpenSwap.TokenPair[],
  ): Balance.Token[] => openswapTokenPairs.map(asYoroiBalanceToken)

  return {
    asOpenswapTokenId,
    asOpenswapPriceTokenAddress,
    asOpenswapAmount,

    asYoroiCompletedOrder,
    asYoroiOpenOrder,

    asYoroiPool,
    asYoroiPools,

    asYoroiTokenId,
    asYoroiBalanceToken,
    asYoroiBalanceTokens,
    asYoroiBalanceTokenInfo,
    asYoroiBalanceTokenInfos,

    asYoroiAmount,
  }
}

// TODO: later replace for @yoroi/wallets
export const asTokenFingerprint = ({
  policyId,
  assetNameHex = '',
}: {
  policyId: string
  assetNameHex: string | undefined
}) => {
  const assetFingerprint = AssetFingerprint.fromParts(
    Buffer.from(policyId, 'hex'),
    Buffer.from(assetNameHex, 'hex'),
  )
  return assetFingerprint.fingerprint()
}

export const asUtf8 = (hex: string) => Buffer.from(hex, 'hex').toString('utf-8')

function isSupportedProvider(
  provider: string,
): provider is Swap.SupportedProvider {
  return supportedProviders.includes(provider as Swap.SupportedProvider)
}
