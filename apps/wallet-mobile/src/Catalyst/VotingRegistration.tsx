import {useNavigation} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import cryptoRandomString from 'crypto-random-string'
import React, {useState} from 'react'
import {useIntl} from 'react-intl'

import {Boundary} from '../components'
import globalMessages from '../i18n/global-messages'
import {
  defaultStackNavigationOptions,
  useWalletNavigation,
  VotingRegistrationRouteNavigation,
  VotingRegistrationRoutes,
} from '../navigation'
import {ConfirmPin} from './ConfirmPin'
import {ConfirmVotingTx} from './ConfirmVotingTx'
import {DisplayPin} from './DisplayPin'
import {DownloadCatalyst} from './DownloadCatalyst'
import {QrCode} from './QrCode'

const Stack = createStackNavigator<VotingRegistrationRoutes>()
export const VotingRegistration = () => {
  const strings = useStrings()
  const navigateTo = useNavigateTo()
  const pin = usePin({length: 4, type: 'numeric'})
  const [votingKeyEncrypted, setVotingKeyEncrypted] = React.useState<string | undefined>(undefined)
  const [complete, setComplete] = React.useState(false)

  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultStackNavigationOptions,
        title: strings.title,
        detachPreviousScreen: false /* https://github.com/react-navigation/react-navigation/issues/9883 */,
      }}
    >
      {!complete ? (
        <Stack.Group>
          <Stack.Screen name="download-catalyst">
            {() => (
              <Boundary loading={{size: 'full'}}>
                <DownloadCatalyst onNext={navigateTo.displayPin} />
              </Boundary>
            )}
          </Stack.Screen>

          <Stack.Screen name="display-pin">
            {() => <DisplayPin onNext={navigateTo.confirmPin} pin={pin} />}
          </Stack.Screen>

          <Stack.Screen name="confirm-pin">
            {/**/}

            {() => <ConfirmPin onNext={navigateTo.confirmTx} pin={pin} />}
          </Stack.Screen>

          <Stack.Screen name="confirm-tx">
            {() => (
              <Boundary loading={{size: 'full'}} error={{size: 'full'}}>
                <ConfirmVotingTx
                  onNext={() => {
                    setComplete(true)
                    navigateTo.qrCode()
                  }}
                  pin={pin}
                  onSuccess={setVotingKeyEncrypted}
                />
              </Boundary>
            )}
          </Stack.Screen>
        </Stack.Group>
      ) : (
        <Stack.Screen name="qr-code" options={{...defaultStackNavigationOptions, headerLeft: () => null}}>
          {() => {
            if (votingKeyEncrypted == null) throw new Error('invalid state')
            return <QrCode onNext={navigateTo.txHistory} votingKeyEncrypted={votingKeyEncrypted} />
          }}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  )
}

const useNavigateTo = () => {
  const navigation = useNavigation<VotingRegistrationRouteNavigation>()
  const {resetToTxHistory} = useWalletNavigation()

  return {
    displayPin: () => navigation.navigate('display-pin'),
    confirmPin: () => navigation.navigate('confirm-pin'),
    confirmTx: () => navigation.navigate('confirm-tx'),
    qrCode: () => navigation.navigate('qr-code'),
    txHistory: () => resetToTxHistory(),
  }
}

const useStrings = () => {
  const intl = useIntl()

  return {
    title: intl.formatMessage(globalMessages.votingTitle),
  }
}

const usePin = (options: cryptoRandomString.Options) => {
  const [pin] = useState(() => cryptoRandomString(options))
  return pin
}
