// @flow

import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {defineMessages, useIntl} from 'react-intl'
import {useSelector} from 'react-redux'

import iconQR from '../../assets/img/qr_code.png'
import {defaultNavigationOptions, defaultStackNavigatorOptions} from '../../navigationOptions'
import {SEND_ROUTES} from '../../RoutesList'
import {tokenBalanceSelector, tokenInfoSelector} from '../../selectors'
import {Button} from '../UiKit'
import AddressReaderQR from './AddressReaderQR'
import {pastedFormatter} from './amountUtils'
import AssetSelectorScreen from './AssetSelectorScreen/AssetSelectorScreen'
import BiometricAuthScreen from './BiometricAuthScreen'
import ConfirmScreen from './ConfirmScreen'
import SendScreen from './SendScreen'
import styles from './styles/QrButton.style'

const getParams = (params) => {
  const query = params.substr(1)
  const result = {}
  query.split('?').forEach((part) => {
    const item = part.split('=')
    result[item[0]] = decodeURIComponent(item[1])
  })
  return result
}

const setAddress = (address, route) => {
  const handlerAddress = route.params?.onScanAddress
  handlerAddress && handlerAddress(address)
}

const setAmount = (amount, route) => {
  const handlerAmount = route.params?.onScanAmount
  handlerAmount && handlerAmount(pastedFormatter(amount))
}

type SendScreenNavigatorRoutes = {
  'send-ada': any,
  'select-asset': any,
  'address-reader-qr': any,
  'send-ada-confirm': any,
  'biometrics-signing': any,
}

const Stack = createStackNavigator<any, SendScreenNavigatorRoutes, any>()

const SendScreenNavigator = () => {
  const strings = useStrings()

  const tokenBalance = useSelector(tokenBalanceSelector)
  const [selectedTokenIdentifier, setSelectedTokenIdentifier] = React.useState<string>(
    tokenBalance.getDefaultEntry().identifier,
  )
  const tokenInfos = useSelector(tokenInfoSelector)
  const [sendAll, setSendAll] = React.useState(false)

  return (
    <Stack.Navigator
      initialRouteName={SEND_ROUTES.MAIN}
      screenOptions={({route}) => ({
        // $FlowFixMe mixed is incompatible with string
        title: route.params?.title ?? undefined,
        ...defaultNavigationOptions,
        ...defaultStackNavigatorOptions,
      })}
    >
      <Stack.Screen
        name={SEND_ROUTES.MAIN}
        options={({navigation, route}) => ({
          title: strings.sendTitle,
          headerRight: () => (
            <Button
              style={styles.qrButton}
              onPress={() =>
                navigation.navigate(SEND_ROUTES.ADDRESS_READER_QR, {
                  onSuccess: (stringQR) => {
                    const regex = /(cardano):([a-zA-Z1-9]\w+)\??/

                    if (regex.test(stringQR)) {
                      const address = stringQR.match(regex)[2]
                      if (stringQR.indexOf('?') !== -1) {
                        const index = stringQR.indexOf('?')
                        const params = getParams(stringQR.substr(index))
                        if ('amount' in params) {
                          setAddress(address, route)
                          setAmount(params.amount, route)
                        }
                      } else {
                        setAddress(address, route)
                        // note: after upgrading to react-navigation v5.x, the
                        // send screen is not unmounted after a tx is sent. If a
                        // new QR code without an amount field is scanned, the
                        // previous value may still remain in state
                        setAmount('', route)
                      }
                    } else {
                      setAddress(stringQR, route)
                      setAmount('', route)
                    }
                    navigation.navigate(SEND_ROUTES.MAIN)
                  },
                })
              }
              iconImage={iconQR}
              title=""
              withoutBackground
            />
          ),
          ...defaultNavigationOptions,
        })}
      >
        {() => (
          <SendScreen selectedTokenIdentifier={selectedTokenIdentifier} onSendAll={setSendAll} sendAll={sendAll} />
        )}
      </Stack.Screen>

      <Stack.Screen name={'select-asset'} options={{title: strings.selectAssetTitle}}>
        {({navigation}) => (
          <AssetSelectorScreen
            assetTokens={tokenBalance.values}
            assetTokenInfos={tokenInfos}
            onSelect={(token) => {
              setSendAll(false)
              setSelectedTokenIdentifier(token.identifier)
              navigation.navigate('send-ada')
            }}
            onSelectAll={() => {
              setSendAll(true)
              setSelectedTokenIdentifier(tokenBalance.getDefaultEntry().identifier)
              navigation.navigate('send-ada')
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name={SEND_ROUTES.ADDRESS_READER_QR}
        component={AddressReaderQR}
        options={{title: strings.qrScannerTitle}}
      />

      <Stack.Screen name={SEND_ROUTES.CONFIRM} component={ConfirmScreen} options={{title: strings.confirmTitle}} />

      <Stack.Screen
        name={SEND_ROUTES.BIOMETRICS_SIGNING}
        component={BiometricAuthScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

export default SendScreenNavigator

const messages = defineMessages({
  sendTitle: {
    id: 'components.send.sendscreen.title',
    defaultMessage: '!!!Send',
  },
  qrScannerTitle: {
    id: 'components.send.addressreaderqr.title',
    defaultMessage: '!!!Scan QR code address',
  },
  selectAssetTitle: {
    id: 'components.send.selectasset.title',
    defaultMessage: '!!!Select asset',
  },
  confirmTitle: {
    id: 'components.send.confirmscreen.title',
    defaultMessage: '!!!Send',
  },
})

const useStrings = () => {
  const intl = useIntl()

  return {
    sendTitle: intl.formatMessage(messages.sendTitle),
    qrScannerTitle: intl.formatMessage(messages.qrScannerTitle),
    selectAssetTitle: intl.formatMessage(messages.selectAssetTitle),
    confirmTitle: intl.formatMessage(messages.confirmTitle),
  }
}
