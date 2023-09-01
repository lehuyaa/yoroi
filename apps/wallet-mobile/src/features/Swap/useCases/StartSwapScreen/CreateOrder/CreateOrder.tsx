import {usePoolsByPair, useSwap} from '@yoroi/swap'
import React, {useEffect, useState} from 'react'
import {KeyboardAvoidingView, Platform, StyleSheet, View, ViewProps} from 'react-native'
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler'

import {Button, Icon, Spacer} from '../../../../../components'
import {useMetrics} from '../../../../../metrics/metricsManager'
import {useSelectedWallet} from '../../../../../SelectedWallet'
import {COLORS} from '../../../../../theme'
import {useTokenInfos} from '../../../../../yoroi-wallets/hooks'
import {Quantities} from '../../../../../yoroi-wallets/utils'
import {ButtonGroup} from '../../../common/ButtonGroup/ButtonGroup'
import {useNavigateTo} from '../../../common/navigation'
import {useStrings} from '../../../common/strings'
import {EditBuyAmount} from './EditBuyAmount/EditBuyAmount'
import {EditLimitPrice} from './EditLimitPrice'
import {ShowPoolActions} from './EditPool/ShowPoolActions'
import {EditSellAmount} from './EditSellAmount/EditSellAmount'
import {EditSlippage} from './EditSlippage/EditSlippage'
import {ShowMarketPrice} from './ShowMarketPrice'
import {ShowTokenActions} from './ShowTokenActions/ShowTokenActions'
import {useSwapTouched} from './TouchedContext'
import BigNumber from 'bignumber.js'
import {LimitPriceWarning} from './LimitPriceWarning/LimitPriceWarning'

const LIMIT_PRICE_WARNING_THRESHOLD = 0.1 // 10%

export const CreateOrder = () => {
  const strings = useStrings()
  const navigation = useNavigateTo()
  const {orderTypeChanged, createOrder, selectedPoolChanged} = useSwap()
  const wallet = useSelectedWallet()
  const {track} = useMetrics()
  const tokenInfos = useTokenInfos({
    wallet,
    tokenIds: [createOrder.amounts.buy.tokenId, createOrder.amounts.sell.tokenId],
  })

  const [showLimitPriceWarning, setShowLimitPriceWarning] = useState(false)
  const {isBuyTouched, isSellTouched} = useSwapTouched()
  const {poolList} = usePoolsByPair({
    tokenA: createOrder.amounts.sell.tokenId,
    tokenB: createOrder.amounts.buy.tokenId,
  })

  useEffect(() => {
    poolList !== undefined && selectedPoolChanged(poolList[0])
  }, [poolList, selectedPoolChanged])

  const orderTypeLabels = [strings.marketButton, strings.limitButton]
  const orderTypeIndex = createOrder.type === 'market' ? 0 : 1
  const handleSelectOrderType = (index: number) => {
    orderTypeChanged(index === 0 ? 'market' : 'limit')
  }

  const disabled =
    !isBuyTouched ||
    !isSellTouched ||
    Quantities.isZero(createOrder.amounts.buy.quantity) ||
    Quantities.isZero(createOrder.amounts.sell.quantity) ||
    (createOrder.type === 'limit' && createOrder.limitPrice !== undefined && Quantities.isZero(createOrder.limitPrice))

  const handleSwap = () => {
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

  const handleSwapPress = () => {
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

    handleSwap()
  }

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <LimitPriceWarning
            open={showLimitPriceWarning}
            onClose={() => setShowLimitPriceWarning(false)}
            onSubmit={() => {
              handleSwap()
              setShowLimitPriceWarning(false)
            }}
          />

          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={86}
          >
            <View style={styles.buttonsGroup}>
              <ButtonGroup labels={orderTypeLabels} onSelect={handleSelectOrderType} selected={orderTypeIndex} />

              <TouchableOpacity>
                <Icon.Refresh size={24} />
              </TouchableOpacity>
            </View>

            <EditSellAmount />

            <Spacer height={16} />

            <ShowTokenActions />

            <Spacer height={16} />

            <EditBuyAmount />

            <Spacer height={20} />

            {createOrder.type === 'market' ? <ShowMarketPrice /> : <EditLimitPrice />}

            <EditSlippage />

            <ShowPoolActions />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>

      <Actions>
        <Button
          testID="swapButton"
          shelleyTheme
          title={strings.swapTitle}
          onPress={handleSwapPress}
          disabled={disabled}
        />
      </Actions>
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
  buttonsGroup: {
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
  },
  actions: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.ACTION_GRAY,
  },
})
