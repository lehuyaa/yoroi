import {getPoolUrlByProvider} from '@yoroi/swap'
import {Balance} from '@yoroi/types'
import {SwapCompletedOrder, SwapOpenOrder} from '@yoroi/types/lib/swap/order'
import {isString} from '@yoroi/wallets'
import BigNumber from 'bignumber.js'

import {NumberLocale} from '../../../../../i18n/languages'
import {TransactionInfo} from '../../../../../yoroi-wallets/types'
import {Quantities} from '../../../../../yoroi-wallets/utils'

const MAX_DECIMALS = 10

export const mapOrders = (
  orders: Array<SwapOpenOrder | SwapCompletedOrder>,
  tokenInfos: Balance.TokenInfo[],
  numberLocale: NumberLocale,
  transactionInfos: TransactionInfo[],
) => {
  if (orders.length === 0) return []

  return orders.map((order) => {
    const {from, to} = order
    const [txIdOpen] = 'utxo' in order ? order.utxo.split('#', 1) : [undefined]
    const txIdComplete = 'txHash' in order ? order.txHash : undefined
    const txId = txIdComplete ?? txIdOpen ?? ''
    const id = `${from.tokenId}-${to.tokenId}-${txId}`
    const txLink = `https://cardanoscan.io/transaction/${txId}` // FIX: this should come from the wallet (preprod/mainnet) explorers

    const txInfo = transactionInfos.find((tx) => tx.id === txId)
    const submittedAt = txInfo?.submittedAt
    const date = isString(submittedAt) ? new Date(submittedAt).toISOString() : ''

    const fromTokenInfo = tokenInfos.find((tokenInfo) => tokenInfo.id === order.from.tokenId)
    const fromLabel = fromTokenInfo?.ticker ?? fromTokenInfo?.name ?? '-'
    const total = BigNumber(Quantities.denominated(from.quantity, fromTokenInfo?.decimals ?? 0)).toFormat(numberLocale)

    const toTokenInfo = tokenInfos.find((tokenInfo) => tokenInfo.id === order.to.tokenId)
    const toLabel = toTokenInfo?.ticker ?? toTokenInfo?.name ?? '-'
    const tokenAmount = BigNumber(Quantities.denominated(to.quantity, toTokenInfo?.decimals ?? 0))
      .decimalPlaces(MAX_DECIMALS)
      .toFormat({
        ...numberLocale,
      })
    const tokenPrice = BigNumber(
      Quantities.quotient(
        Quantities.denominated(from.quantity, fromTokenInfo?.decimals ?? 0),
        Quantities.denominated(to.quantity, toTokenInfo?.decimals ?? 0),
      ),
    )
      .decimalPlaces(MAX_DECIMALS)
      .toFormat(numberLocale)

    return {
      tokenPrice,
      tokenAmount,
      id,
      assetFromLabel: fromLabel,
      assetToLabel: toLabel,
      date,
      txId,
      total,
      txLink,
      fromTokenInfo,
      toTokenInfo,
      provider: 'provider' in order ? order.provider : undefined,
      poolUrl: 'provider' in order ? getPoolUrlByProvider(order.provider) : undefined,
    }
  })
}
