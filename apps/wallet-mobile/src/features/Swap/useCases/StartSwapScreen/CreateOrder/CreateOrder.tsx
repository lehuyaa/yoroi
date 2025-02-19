import {isString} from '@yoroi/common'
import {makeLimitOrder, makePossibleMarketOrder, useSwap, useSwapCreateOrder, useSwapPoolsByPair} from '@yoroi/swap'
import {Swap} from '@yoroi/types'
import BigNumber from 'bignumber.js'
import * as React from 'react'
import {Alert, KeyboardAvoidingView, Platform, StyleSheet, useWindowDimensions, View, ViewProps} from 'react-native'
import Config from 'react-native-config'
import {ScrollView} from 'react-native-gesture-handler'

import {Button, Spacer, useModal} from '../../../../../components'
import {useMetrics} from '../../../../../metrics/metricsManager'
import {useWalletNavigation} from '../../../../../navigation'
import {useDisableSearchOnBar} from '../../../../../Search/SearchContext'
import {useSelectedWallet} from '../../../../../SelectedWallet'
import {COLORS} from '../../../../../theme'
import {NotEnoughMoneyToSendError} from '../../../../../yoroi-wallets/cardano/types'
import {useTokenInfo} from '../../../../../yoroi-wallets/hooks'
import {YoroiEntry} from '../../../../../yoroi-wallets/types'
import {Quantities} from '../../../../../yoroi-wallets/utils'
import {createOrderEntry, makePossibleFrontendFeeEntry} from '../../../common/entries'
import {useNavigateTo} from '../../../common/navigation'
import {useStrings} from '../../../common/strings'
import {useSwapForm} from '../../../common/SwapFormProvider'
import {useSwapTx} from '../../../common/useSwapTx'
import {EditBuyAmount} from './EditBuyAmount/EditBuyAmount'
import {EditLimitPrice} from './EditLimitPrice'
import {ShowPoolActions} from './EditPool/ShowPoolActions'
import {EditSellAmount} from './EditSellAmount/EditSellAmount'
import {EditSlippage} from './EditSlippage/EditSlippage'
import {LimitPriceWarning} from './LimitPriceWarning/LimitPriceWarning'
import {ShowTokenActions} from './ShowTokenActions/ShowTokenActions'
import {TopTokenActions} from './ShowTokenActions/TopTokenActions'
import {SlippageWarning} from './SlippageWarning'

const LIMIT_PRICE_WARNING_THRESHOLD = 0.1 // 10%
const BOTTOM_ACTION_SECTION = 180

export const CreateOrder = () => {
  const [contentHeight, setContentHeight] = React.useState(0)
  const strings = useStrings()
  const navigateTo = useNavigateTo()
  const {navigateToTxHistory} = useWalletNavigation()
  const {orderData, unsignedTxChanged, poolPairsChanged} = useSwap()
  const wallet = useSelectedWallet()
  const {track} = useMetrics()
  const {openModal} = useModal()
  const {height: deviceHeight} = useWindowDimensions()

  const {
    sellQuantity: {isTouched: isSellTouched},
    buyQuantity: {isTouched: isBuyTouched},
    sellAmountErrorChanged,
    poolDefaulted,
    canSwap,
  } = useSwapForm()

  useSwapPoolsByPair(
    {
      tokenA: orderData.amounts.sell.tokenId,
      tokenB: orderData.amounts.buy.tokenId,
    },
    {
      enabled: isBuyTouched && isSellTouched,
      onSuccess: (pools) => {
        poolPairsChanged(pools)
      },
    },
  )

  useDisableSearchOnBar({
    title: strings.swapTitle,
    isChild: true,
    onBack: navigateToTxHistory,
  })

  const sellTokenInfo = useTokenInfo({
    wallet,
    tokenId: orderData.amounts.sell.tokenId,
  })
  const buyTokenInfo = useTokenInfo({
    wallet,
    tokenId: orderData.amounts.buy.tokenId,
  })

  React.useEffect(() => {
    if (orderData.selectedPoolId === orderData.bestPoolCalculation?.pool.poolId) poolDefaulted()
  }, [orderData.selectedPoolId, orderData.bestPoolCalculation, poolDefaulted])

  const {createUnsignedTx, isLoading} = useSwapTx({
    onSuccess: (yoroiUnsignedTx) => {
      unsignedTxChanged(yoroiUnsignedTx)
      swap()
    },
    onError: (error) => {
      if (error instanceof NotEnoughMoneyToSendError) {
        sellAmountErrorChanged(strings.notEnoughFeeBalance)
        return
      }

      Alert.alert(strings.generalErrorTitle, strings.generalErrorMessage(error.message))
    },
  })

  const {createOrderData} = useSwapCreateOrder({
    onSuccess: (orderResponse: Swap.CreateOrderResponse) => {
      if (
        orderResponse?.contractAddress === undefined ||
        orderData.selectedPoolCalculation?.pool === undefined ||
        !isString(orderResponse?.datum)
      ) {
        Alert.alert(strings.generalErrorTitle, strings.generalTxErrorMessage)
        return
      }

      const {amounts, selectedPoolCalculation} = orderData
      const {contractAddress, datum: datumData} = orderResponse
      const datum: YoroiEntry['datum'] = datumData != null ? {data: datumData} : undefined
      const orderEntry = createOrderEntry(
        amounts,
        selectedPoolCalculation.pool,
        contractAddress,
        wallet.primaryTokenInfo.id,
        datum,
      )

      const isMainnet = wallet.networkId !== 300
      const frontendFee = selectedPoolCalculation.cost.frontendFeeInfo.fee
      const frontendFeeDepositAddress = isMainnet
        ? Config['FRONTEND_FEE_ADDRESS_MAINNET']
        : Config['FRONTEND_FEE_ADDRESS_PREPROD']
      const frontendFeeEntry = makePossibleFrontendFeeEntry(frontendFee, frontendFeeDepositAddress)

      const entries = frontendFeeEntry != null ? [orderEntry, frontendFeeEntry] : [orderEntry]

      createUnsignedTx({entries})
    },
    onError: (error) => {
      Alert.alert(strings.generalErrorTitle, strings.generalErrorMessage(error))
    },
  })

  const swap = () => {
    if (orderData.selectedPoolCalculation === undefined) return
    track.swapOrderSelected({
      from_asset: [
        {asset_name: sellTokenInfo.name, asset_ticker: sellTokenInfo.ticker, policy_id: sellTokenInfo.group},
      ],
      to_asset: [{asset_name: buyTokenInfo.name, asset_ticker: buyTokenInfo.ticker, policy_id: buyTokenInfo.group}],
      order_type: orderData.type,
      slippage_tolerance: orderData.slippage,
      from_amount: orderData.amounts.sell.quantity,
      to_amount: orderData.amounts.buy.quantity,
      pool_source: orderData.selectedPoolCalculation.pool.provider,
      swap_fees: Number(
        Quantities.denominated(
          orderData.selectedPoolCalculation.pool.batcherFee.quantity,
          Number(wallet.primaryTokenInfo.decimals),
        ),
      ),
    })

    navigateTo.confirmTx()
  }

  const createSwapOrder = (orderData: Swap.CreateOrderData) => {
    createOrderData({
      amounts: {
        sell: orderData.amounts.sell,
        buy: orderData.amounts.buy,
      },
      address: orderData?.address,
      slippage: orderData.slippage,
      selectedPool: orderData.selectedPool,
    })
  }

  const createUnsignedSwapTx = () => {
    const orderDetails = {
      sell: orderData.amounts.sell,
      buy: orderData.amounts.buy,
      pools: orderData.pools,
      selectedPool: orderData.selectedPoolCalculation?.pool,
      slippage: orderData.slippage,
      address: wallet.externalAddresses[0],
    }

    if (orderDetails.pools === undefined || orderDetails.selectedPool === undefined) return

    if (orderData.type === 'market') {
      const orderResult: Swap.CreateOrderData | undefined = makePossibleMarketOrder(
        orderDetails.sell,
        orderDetails.buy,
        orderDetails.selectedPool,
        orderDetails.slippage,
        orderDetails.address,
      )
      if (orderResult) createSwapOrder(orderResult)
    }

    if (orderData.type === 'limit') {
      const orderResult = makeLimitOrder(
        orderDetails.sell,
        orderDetails.buy,
        orderDetails.selectedPool,
        orderDetails.slippage,
        orderDetails.address,
      )
      createSwapOrder(orderResult)
    }
  }

  const handleOnSwap = () => {
    if (orderData.selectedPoolCalculation === undefined) return
    if (orderData.type === 'limit' && orderData.limitPrice !== undefined) {
      const marketPrice = new BigNumber(orderData.selectedPoolCalculation.prices.market)
      const limitPrice = new BigNumber(orderData.limitPrice)

      if (limitPrice.isGreaterThan(marketPrice.times(1 + LIMIT_PRICE_WARNING_THRESHOLD))) {
        openModal(
          strings.limitPriceWarningTitle,
          <LimitPriceWarning orderData={orderData} onSubmit={createUnsignedSwapTx} />,
          400,
        )
        return
      }
    }

    const minReceived = Quantities.denominated(
      orderData.selectedPoolCalculation.buyAmountWithSlippage.quantity,
      buyTokenInfo.decimals ?? 0,
    )

    if (Quantities.isZero(minReceived)) {
      openModal(
        strings.slippageWarningTitle,
        <SlippageWarning
          onSubmit={createUnsignedSwapTx}
          slippage={orderData.slippage}
          ticker={buyTokenInfo.ticker ?? buyTokenInfo.name ?? ''}
        />,
        350,
      )
      return
    }

    createUnsignedSwapTx()
  }

  const disabled = isLoading || !canSwap

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={120}
      >
        <ScrollView style={styles.scroll}>
          <View
            style={styles.container}
            onLayout={(event) => {
              const {height} = event.nativeEvent.layout
              setContentHeight(height + BOTTOM_ACTION_SECTION)
            }}
          >
            <TopTokenActions />

            <EditSellAmount />

            <Spacer height={16} />

            <ShowTokenActions />

            <Spacer height={16} />

            <EditBuyAmount />

            <Spacer height={20} />

            <EditLimitPrice />

            <EditSlippage />

            <ShowPoolActions />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Actions
        style={{
          ...(deviceHeight < contentHeight && styles.actionBorder),
        }}
      >
        <Button testID="swapButton" shelleyTheme title={strings.swapTitle} onPress={handleOnSwap} disabled={disabled} />
      </Actions>
    </View>
  )
}

const Actions = ({style, ...props}: ViewProps) => <View style={[styles.actions, style]} {...props} />

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    paddingTop: 10,
  },
  flex: {
    flex: 1,
  },
  actions: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_GRAY,
  },
})
