import {useNavigation} from '@react-navigation/native'
import {banxaModuleMaker} from '@yoroi/banxa'
import {useSwap} from '@yoroi/swap'
import React, {ReactNode} from 'react'
import {useIntl} from 'react-intl'
import {Linking, Platform, StyleSheet, TouchableOpacity, View} from 'react-native'

import {Button, Icon, Spacer, Text, useModal} from '../components'
import {useSend} from '../features/Send/common/SendContext'
import {useSwapForm} from '../features/Swap/common/SwapFormProvider'
import {actionMessages} from '../i18n/global-messages'
import env from '../legacy/env'
import {useMetrics} from '../metrics/metricsManager'
import {TxHistoryRouteNavigation} from '../navigation'
import {useSelectedWallet} from '../SelectedWallet'
import {COLORS} from '../theme'
import {useTokenInfo} from '../yoroi-wallets/hooks'

const ACTION_PROPS = {
  size: 32,
  color: COLORS.WHITE,
}

export const ActionsBanner = ({disabled = false}: {disabled: boolean}) => {
  const strings = useStrings()
  const navigateTo = useNavigateTo()
  const wallet = useSelectedWallet()
  const {resetForm} = useSend()
  const {orderData} = useSwap()
  const {resetSwapForm} = useSwapForm()
  const {track} = useMetrics()
  const sellTokenInfo = useTokenInfo({
    wallet,
    tokenId: orderData.amounts.sell.tokenId,
  })
  const buyTokenInfo = useTokenInfo({
    wallet,
    tokenId: orderData.amounts.buy.tokenId,
  })
  const {openModal, closeModal} = useModal()

  const handleOnBuy = () => {
    track.walletPageExchangeClicked()

    const modalHeight = 320
    const modalTextFormattingOptions: BuyInfoFormattingOptions = {
      b: (text) => <Text style={[styles.buyInfo, styles.bold]}>{text}</Text>,
      textComponent: (text) => <Text style={styles.buyInfo}>{text}</Text>,
    }

    openModal(
      strings.buyTitle,
      <View style={styles.buyModalContent}>
        <Text style={styles.buyInfo}>{strings.buyInfo(modalTextFormattingOptions)}</Text>

        <Spacer fill />

        <Button
          shelleyTheme
          title={strings.proceed}
          onPress={() => {
            track.walletPageExchangeBottomSheetClicked()
            // banxa doesn't support testnet for the sandbox it needs a mainnet address
            const sandboxWallet = env.getString('BANXA_TEST_WALLET')
            const isMainnet = wallet.networkId !== 300
            const walletAddress = isMainnet ? wallet.externalAddresses[0] : sandboxWallet
            const moduleOptions = {isProduction: isMainnet, partner: 'yoroi'} as const
            const urlOptions = {
              coinType: 'ADA',
              fiatType: 'USD',
              blockchain: 'ADA',
              walletAddress,
            } as const
            const banxa = banxaModuleMaker(moduleOptions)
            const url = banxa.createReferralUrl(urlOptions)
            Linking.openURL(url.toString())
            closeModal()
          }}
        />

        {Platform.OS === 'ios' && <Spacer height={20} />}
      </View>,
      modalHeight,
    )
  }

  const handleOnSend = () => {
    navigateTo.send()
    resetForm()
  }

  const handleOnSwap = () => {
    resetSwapForm()

    track.swapInitiated({
      from_asset: [
        {asset_name: sellTokenInfo.name, asset_ticker: sellTokenInfo.ticker, policy_id: sellTokenInfo.group},
      ],
      to_asset: [{asset_name: buyTokenInfo.name, asset_ticker: buyTokenInfo.ticker, policy_id: buyTokenInfo.group}],
      order_type: orderData.type,
      slippage_tolerance: orderData.slippage,
    })

    navigateTo.swap()
  }

  return (
    <View style={styles.banner}>
      <Spacer height={16} />

      <View style={styles.centralized}>
        <View style={[styles.row, disabled && styles.disabled]}>
          {!wallet.isReadOnly && (
            <View style={styles.centralized}>
              <TouchableOpacity
                style={styles.actionIcon}
                onPress={handleOnSend}
                testID="sendButton"
                disabled={disabled}
              >
                <Icon.Send {...ACTION_PROPS} />
              </TouchableOpacity>

              <Text style={styles.actionLabel}>{strings.sendLabel}</Text>
            </View>
          )}

          {!wallet.isReadOnly && <Spacer width={32} />}

          <View style={styles.centralized}>
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={navigateTo.receive}
              testID="receiveButton"
              disabled={disabled}
            >
              <Icon.Received {...ACTION_PROPS} />
            </TouchableOpacity>

            <Text style={styles.actionLabel}>{strings.receiveLabel}</Text>
          </View>

          {!wallet.isReadOnly && (
            <>
              <Spacer width={32} />

              <View style={styles.centralized}>
                <TouchableOpacity
                  style={styles.actionIcon}
                  onPress={handleOnSwap}
                  testID="swapButton"
                  disabled={disabled}
                >
                  <Icon.Swap color={ACTION_PROPS.color} />
                </TouchableOpacity>

                <Text style={styles.actionLabel}>{strings.swapLabel}</Text>
              </View>

              <Spacer width={32} />

              <View style={styles.centralized}>
                <TouchableOpacity
                  style={styles.actionIcon}
                  onPress={handleOnBuy}
                  testID="buyButton"
                  disabled={disabled}
                >
                  <Icon.PlusCircle {...ACTION_PROPS} />
                </TouchableOpacity>

                <Text style={styles.actionLabel}>{strings.buyLabel}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <Spacer height={21} />
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  centralized: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    width: 42,
    borderRadius: 20,
    backgroundColor: '#3154CB',
  },
  actionLabel: {
    paddingTop: 8,
    fontSize: 12,
    color: '#000000',
    fontFamily: 'Rubik-Regular',
    fontWeight: '500',
    lineHeight: 18,
  },
  buyInfo: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Rubik-Regular',
    fontWeight: '400',
    lineHeight: 24,
  },
  bold: {
    fontWeight: '500',
    fontFamily: 'Rubik-Medium',
  },
  disabled: {
    opacity: 0.5,
  },
  buyModalContent: {
    flex: 1,
  },
})

const useStrings = () => {
  const intl = useIntl()

  return {
    sendLabel: intl.formatMessage(actionMessages.send),
    receiveLabel: intl.formatMessage(actionMessages.receive),
    buyLabel: intl.formatMessage(actionMessages.buy),
    buyTitle: intl.formatMessage(actionMessages.buyTitle),
    buyInfo: (options: BuyInfoFormattingOptions) => intl.formatMessage(actionMessages.buyInfo, options),
    proceed: intl.formatMessage(actionMessages.proceed),
    swapLabel: intl.formatMessage(actionMessages.swap),
    messageBuy: intl.formatMessage(actionMessages.soon),
  }
}

type BuyInfoFormattingOptions = Record<'b' | 'textComponent', (text: ReactNode[]) => ReactNode>

const useNavigateTo = () => {
  const navigation = useNavigation<TxHistoryRouteNavigation>()

  return {
    send: () => navigation.navigate('send-start-tx'),
    receive: () => navigation.navigate('receive'),
    swap: () => navigation.navigate('swap-start-swap'),
  }
}
