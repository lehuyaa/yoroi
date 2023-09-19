import {makeLimitOrder, makePossibleMarketOrder, useCreateOrder, usePoolsByPair, useSwap} from '@yoroi/swap'
import {Swap} from '@yoroi/types'
import BigNumber from 'bignumber.js'
import React, {useEffect, useState} from 'react'
import {KeyboardAvoidingView, Platform, StyleSheet, View, ViewProps} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'

import {Button, Spacer} from '../../../../../components'
import {LoadingOverlay} from '../../../../../components/LoadingOverlay'
import {useMetrics} from '../../../../../metrics/metricsManager'
import {useAddresses} from '../../../../../Receive/Addresses'
import {useSelectedWallet} from '../../../../../SelectedWallet'
import {COLORS} from '../../../../../theme'
import {useTokenInfos} from '../../../../../yoroi-wallets/hooks'
import {Quantities} from '../../../../../yoroi-wallets/utils'
import {createYoroiEntry} from '../../../common/helpers'
import {useNavigateTo} from '../../../common/navigation'
import {useStrings} from '../../../common/strings'
import {useSwapTouched} from '../../../common/SwapFormProvider'
import {useSwapTx} from '../../../common/useSwapTx'
import {EditBuyAmount} from './EditBuyAmount/EditBuyAmount'
import {EditLimitPrice} from './EditLimitPrice'
import {ShowPoolActions} from './EditPool/ShowPoolActions'
import {EditSellAmount} from './EditSellAmount/EditSellAmount'
import {EditSlippage} from './EditSlippage/EditSlippage'
import {LimitPriceWarning} from './LimitPriceWarning/LimitPriceWarning'
import {ShowTokenActions} from './ShowTokenActions/ShowTokenActions'
import {TopTokenActions} from './ShowTokenActions/TopTokenActions'

const LIMIT_PRICE_WARNING_THRESHOLD = 0.1 // 10%

export const CreateOrder = () => {
  const strings = useStrings()
  const navigation = useNavigateTo()
  const {createOrder, selectedPoolChanged, unsignedTxChanged, txPayloadChanged} = useSwap()
  const wallet = useSelectedWallet()
  const {track} = useMetrics()
  const addresses = useAddresses()

  const tokenInfos = useTokenInfos({
    wallet,
    tokenIds: [createOrder.amounts.buy.tokenId, createOrder.amounts.sell.tokenId],
  })
  const [showLimitPriceWarning, setShowLimitPriceWarning] = useState(false)
  const {isBuyTouched, isSellTouched, poolDefaulted} = useSwapTouched()
  const {poolList} = usePoolsByPair({
    tokenA: createOrder.amounts.sell.tokenId ?? '',
    tokenB: createOrder.amounts.buy.tokenId ?? '',
  })

  useEffect(() => {
    if (poolList !== undefined) {
      const bestPool = poolList.map((a) => a).sort((a, b) => a.price - b.price)[0]
      selectedPoolChanged(bestPool)
      poolDefaulted()
    }
  }, [poolDefaulted, selectedPoolChanged, poolList])

  const {createUnsignedTx, isLoading} = useSwapTx({
    onSuccess: (yoroiUnsignedTx) => {
      unsignedTxChanged(yoroiUnsignedTx)
      swap()
      setShowLimitPriceWarning(false)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const {createOrderData} = useCreateOrder({
    onSuccess: (data: Swap.CreateOrderResponse) => {
      if (data?.contractAddress !== undefined) {
        const entry = createYoroiEntry(createOrder, data.contractAddress, wallet)
        const datum = {data: data.datum}
        txPayloadChanged({datum: data.datum, datumHash: data.datumHash, contractAddress: data.contractAddress})
        createUnsignedTx({entry, datum})
      }
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const disabled =
    !isBuyTouched ||
    !isSellTouched ||
    Quantities.isZero(createOrder.amounts.buy.quantity) ||
    Quantities.isZero(createOrder.amounts.sell.quantity) ||
    (createOrder.type === 'limit' && createOrder.limitPrice !== undefined && Quantities.isZero(createOrder.limitPrice))

  const swap = () => {
    const sellTokenInfo = tokenInfos.filter((tokenInfo) => tokenInfo.id === createOrder.amounts.sell.tokenId)[0]
    const buyTokenInfo = tokenInfos.filter((tokenInfo) => tokenInfo.id === createOrder.amounts.buy.tokenId)[0]

    track.swapOrderSelected({
      from_asset: [
        {asset_name: sellTokenInfo.name, asset_ticker: sellTokenInfo.ticker, policy_id: sellTokenInfo.group},
      ],
      to_asset: [{asset_name: buyTokenInfo.name, asset_ticker: buyTokenInfo.ticker, policy_id: buyTokenInfo.group}],
      order_type: createOrder.type,
      slippage_tolerance: createOrder.slippage,
      from_amount: createOrder.amounts.sell.quantity,
      to_amount: createOrder.amounts.buy.quantity,
      pool_source: createOrder.selectedPool.provider,
      swap_fees: Number(createOrder.selectedPool.fee),
    })

    navigation.confirmTx()
  }

  const createUnsignedSwapTx = () => {
    const {amounts} = createOrder
    const orderDetails = {
      sell: amounts.sell,
      buy: amounts.buy,
      pools: poolList,
      selectedPool: createOrder.selectedPool,
      slippage: createOrder.slippage * 100,
      address: addresses.used[0],
    }
    if (createOrder.type === 'market' && poolList !== undefined) {
      const orderResult: Swap.CreateOrderData | undefined = makePossibleMarketOrder(
        orderDetails.sell,
        orderDetails.buy,
        orderDetails?.pools as Swap.PoolPair[],
        orderDetails.slippage,
        orderDetails.address,
      )
      orderResult && createSwapOrder(orderResult)
    }
    if (createOrder.type === 'limit' && poolList !== undefined) {
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

  const handleOnSwap = () => {
    if (createOrder.type === 'limit' && createOrder.limitPrice !== undefined) {
      const marketPrice = BigNumber(
        isBuyTouched &&
          isSellTouched &&
          createOrder.selectedPool?.price !== undefined &&
          !Number.isNaN(createOrder.selectedPool.price)
          ? createOrder.selectedPool.price
          : 0,
      )
      const limitPrice = BigNumber(createOrder.limitPrice)

      if (limitPrice.isGreaterThan(marketPrice.times(1 + LIMIT_PRICE_WARNING_THRESHOLD))) {
        setShowLimitPriceWarning(true)
        return
      }
    }

    createUnsignedSwapTx()
  }

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Spacer height={16} />

          <LimitPriceWarning
            open={showLimitPriceWarning}
            onClose={() => setShowLimitPriceWarning(false)}
            onSubmit={() => {
              handleOnSwap()
            }}
          />

          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={86}
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
          </KeyboardAvoidingView>
        </View>
      </ScrollView>

      <Actions>
        <Button testID="swapButton" shelleyTheme title={strings.swapTitle} onPress={handleOnSwap} disabled={disabled} />
      </Actions>

      <LoadingOverlay loading={isLoading} />
    </>
  )
}

const Actions = ({style, ...props}: ViewProps) => <View style={[styles.actions, style]} {...props} />

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  flex: {
    flex: 1,
  },
  actions: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_GRAY,
  },
})
