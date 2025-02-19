import {MaterialTopTabNavigationOptions} from '@react-navigation/material-top-tabs'
import {NavigatorScreenParams, useNavigation, useRoute} from '@react-navigation/native'
import {StackNavigationOptions, StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {Dimensions, Platform, TouchableOpacity} from 'react-native'

import {Icon} from './components'
import {ScanFeature} from './features/Scan/common/types'
import {COLORS} from './theme'
import {HWDeviceInfo} from './yoroi-wallets/hw'
import {NetworkId, WalletImplementationId, YoroiUnsignedTx} from './yoroi-wallets/types'

// prettier-ignore
export const useUnsafeParams = <Params, >() => {
  const route = useRoute()

  return route?.params as unknown as Params
}

// prettier-ignore
export const useParams = <Params, >(guard: Guard<Params>): Params => {
  const params = useRoute().params

  if (!params || !guard(params)) {
    throw new Error(`useParams: guard failed: ${JSON.stringify(params, null, 2)}`)
  }

  return params
}

type Guard<Params> = (params: Params | object) => params is Params

export const BackButton = (props) => (
  <TouchableOpacity {...props} testID="buttonBack2">
    <Icon.Chevron direction="left" color={props.color ?? '#000000'} />
  </TouchableOpacity>
)

// OPTIONS
const WIDTH = Dimensions.get('window').width
export const defaultStackNavigationOptions: StackNavigationOptions = {
  headerTintColor: COLORS.ERROR_TEXT_COLOR_DARK,
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: '#fff',
  },
  headerTitleStyle: {
    fontSize: 16,
    fontFamily: 'Rubik-Medium',
    width: WIDTH - 75,
    textAlign: 'center',
  },
  headerTitleAlign: 'center',
  headerTitleContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLeftContainerStyle: {
    paddingLeft: 10,
  },
  headerRightContainerStyle: {
    paddingRight: 10,
  },
  cardStyle: {backgroundColor: 'white'},
  headerLeft: (props) => <BackButton {...props} />,
}

export const DEPRECATED_defaultStackNavigationOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: COLORS.BACKGROUND_BLUE,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: '#fff',
  headerBackTitleVisible: false,
  headerTitleAlign: 'center',
  headerLeftContainerStyle: {
    paddingLeft: Platform.OS === 'ios' ? 8 : undefined,
  },
  headerLeft: (props) => <BackButton color="#fff" {...props} />,
}

// NAVIGATOR TOP TABS OPTIONS
export const defaultMaterialTopTabNavigationOptions: MaterialTopTabNavigationOptions = {
  tabBarStyle: {backgroundColor: COLORS.WHITE, elevation: 0, shadowOpacity: 0, marginHorizontal: 16},
  tabBarIndicatorStyle: {backgroundColor: COLORS.SHELLEY_BLUE, height: 2},
  tabBarLabelStyle: {
    textTransform: 'none',
    fontFamily: 'Rubik-Medium',
    fontSize: 16,
    fontWeight: '500',
  },
  tabBarActiveTintColor: COLORS.SHELLEY_BLUE,
  tabBarInactiveTintColor: COLORS.NOT_SELECTED_TAB_TEXT,
}

// ROUTES
export type WalletTabRoutes = {
  history: NavigatorScreenParams<TxHistoryRoutes>
  'staking-dashboard': NavigatorScreenParams<DashboardRoutes>
  nfts: NavigatorScreenParams<NftRoutes>
  menu: NavigatorScreenParams<MenuRoutes>
}

export type WalletStackRoutes = {
  'wallet-selection': undefined
  'main-wallet-routes': NavigatorScreenParams<WalletTabRoutes>
  'nft-details-routes': NavigatorScreenParams<NftRoutes>
  settings: NavigatorScreenParams<SettingsStackRoutes>
  'voting-registration': NavigatorScreenParams<VotingRegistrationRoutes>
  'toggle-analytics-settings': NavigatorScreenParams<ToggleAnalyticsSettingsRoutes>
}
export type WalletStackRouteNavigation = StackNavigationProp<WalletStackRoutes>

export type WalletInitRoutes = {
  'choose-create-restore': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
  }
  'initial-choose-create-restore': undefined
  'create-wallet-form': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
  }
  'restore-wallet-form': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
  }
  'import-read-only': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
  }
  'save-read-only': {
    publicKeyHex: string
    path: number[]
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
  }
  'check-nano-x': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
    useUSB: boolean
  }
  'connect-nano-x': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
    useUSB: boolean
  }
  'save-nano-x': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
    hwDeviceInfo: HWDeviceInfo
  }
  'mnemonic-show': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
    password: string
    name: string
    mnemonic: string
  }
  'mnemonic-check': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
    password: string
    name: string
    mnemonic: string
  }
  'wallet-account-checksum': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
    phrase: string
  }
  'wallet-credentials': {
    networkId: NetworkId
    walletImplementationId: WalletImplementationId
    phrase: string
  }
}
export type WalletInitRouteNavigation = StackNavigationProp<WalletInitRoutes>

export type ReceiveRoutes = {
  'receive-ada-main': undefined
}

export type TxHistoryRoutes = {
  'history-list': undefined
  'history-details': {
    id: string
  }
  receive: undefined
  'send-start-tx': undefined
  'send-confirm-tx': undefined
  'send-submitted-tx': {txId: string}
  'send-failed-tx': undefined
  'send-list-amounts-to-send': undefined
  'send-edit-amount': undefined
  'send-select-token-from-list': undefined
} & SwapTokenRoutes &
  ScanRoutes &
  ClaimRoutes
export type TxHistoryRouteNavigation = StackNavigationProp<TxHistoryRoutes>

type ScanStartParams = Readonly<{
  insideFeature: ScanFeature
}>
export type ScanRoutes = {
  'scan-start': ScanStartParams
  'scan-claim-confirm-summary': undefined
  'scan-show-camera-permission-denied': undefined
}
export type ClaimRoutes = {
  'claim-show-success': undefined
}

export type SwapTokenRoutes = {
  'swap-start-swap': undefined
  'swap-confirm-tx': undefined
  'swap-select-sell-token': undefined
  'swap-select-buy-token': undefined
  'swap-edit-slippage': undefined
  'swap-select-pool': undefined
  'swap-submitted-tx': {txId: string}
  'swap-failed-tx': undefined
  'app-root': undefined
}
export type SwapTokenRouteseNavigation = StackNavigationProp<SwapTokenRoutes>

export type StakingCenterRoutes = {
  'staking-center-main': undefined
  'delegation-confirmation': {
    poolId: string
    yoroiUnsignedTx: YoroiUnsignedTx
  }
}

export type SwapTabRoutes = {
  'token-swap': undefined
  orders: undefined
}

export type StakingCenterRouteNavigation = StackNavigationProp<StakingCenterRoutes>

export type SettingsTabRoutes = {
  'wallet-settings': undefined
  'app-settings': undefined
}

export type SettingsStackRoutes = {
  about: undefined
  'app-settings': undefined
  'main-settings': undefined
  'change-wallet-name': undefined
  'terms-of-use': undefined
  support: undefined
  analytics: undefined
  'enable-login-with-os': undefined
  'remove-wallet': undefined
  'change-language': undefined
  'change-currency': undefined
  'enable-easy-confirmation': undefined
  'disable-easy-confirmation': undefined
  'change-password': undefined
  'change-custom-pin': undefined
  'privacy-policy': undefined
  'enable-login-with-pin': {
    onSuccess: () => void | Promise<void>
  }
  'manage-collateral': undefined
  'collateral-confirm-tx': undefined
  'collateral-tx-submitted': undefined
  'collateral-tx-failed': undefined
}

export type ToggleAnalyticsSettingsRoutes = {
  settings: undefined
}

export type SettingsRouteNavigation = StackNavigationProp<SettingsStackRoutes>

export type SendConfirmParams = {
  yoroiUnsignedTx: YoroiUnsignedTx
}

export type DashboardRoutes = {
  'staking-dashboard-main': undefined
  'staking-center': NavigatorScreenParams<StakingCenterRoutes>
  'delegation-confirmation': undefined
}

export type VotingRegistrationRoutes = {
  'download-catalyst': undefined
  'display-pin': undefined
  'confirm-pin': undefined
  'create-tx': undefined
  'confirm-tx': undefined
  'qr-code': undefined
}
export type VotingRegistrationRouteNavigation = StackNavigationProp<VotingRegistrationRoutes>

export type InititalizationRoutes = {
  initial: undefined
  'language-pick': undefined
  'enable-login-with-pin': undefined
  analytics: undefined
  'terms-of-service-changed': undefined
  'analytics-changed': undefined
  'read-terms-of-service': undefined
  'read-privacy-policy': undefined
}
export type InititalizationNavigation = StackNavigationProp<InititalizationRoutes>

export type FirstRunRoutes = {
  'language-pick': undefined
  'accept-terms-of-service': undefined
  'accept-privacy-policy': undefined
  'enable-login-with-pin': undefined
}
export type FirstRunRouteNavigation = StackNavigationProp<FirstRunRoutes>

export type NftRoutes = {
  'nft-gallery': undefined
  'nft-details': {id: string}
  'image-zoom': {id: string}
}

export type MenuRoutes = {
  menu: undefined
  'voting-registration': undefined
}

export type AppRoutes = {
  'first-run': NavigatorScreenParams<FirstRunRoutes>
  developer: undefined
  storybook: undefined
  'new-wallet': NavigatorScreenParams<WalletInitRoutes>
  'app-root': NavigatorScreenParams<WalletStackRoutes>
  'custom-pin-auth': undefined
  'bio-auth-initial': undefined
  'enable-login-with-pin': undefined
  'agreement-changed-notice': undefined
  modal: undefined
}
export type AppRouteNavigation = StackNavigationProp<AppRoutes>

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends AppRoutes {}
  }
}

export const useBlockGoBack = () => {
  const navigation = useNavigation()

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type !== 'RESET') {
        e.preventDefault()
      }
    })
    return () => unsubscribe()
  }, [navigation])
}

export const useWalletNavigation = () => {
  const navigation = useNavigation()

  return React.useRef({
    navigation,

    resetToTxHistory: () => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'app-root',
            state: {
              routes: [
                {name: 'wallet-selection'},
                {
                  name: 'main-wallet-routes',
                  state: {
                    routes: [
                      {
                        name: 'history',
                        state: {
                          routes: [{name: 'history-list'}],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      })
    },

    resetToWalletSelection: () => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'app-root',
            state: {
              routes: [{name: 'wallet-selection'}],
            },
          },
        ],
      })
    },

    navigateToSettings: () => {
      navigation.navigate('app-root', {
        screen: 'settings',
        params: {
          screen: 'main-settings',
        },
      })
    },

    navigateToTxHistory: () => {
      navigation.navigate('app-root', {
        screen: 'main-wallet-routes',
        params: {
          screen: 'history',
          params: {
            screen: 'history-list',
          },
        },
      })
    },

    navigateToNftGallery: () => {
      navigation.navigate('app-root', {
        screen: 'main-wallet-routes',
        params: {
          screen: 'nfts',
          params: {
            screen: 'nft-gallery',
          },
        },
      })
    },

    navigateToAppSettings: () => {
      navigation.navigate('app-root', {
        screen: 'settings',
        params: {
          screen: 'app-settings',
        },
      })
    },

    navigateToCollateralSettings: () => {
      navigation.navigate('app-root', {
        screen: 'settings',
        params: {
          screen: 'manage-collateral',
        },
      })
    },

    navigateToAnalyticsSettings: () => {
      navigation.navigate('app-root', {
        screen: 'toggle-analytics-settings',
        params: {
          screen: 'settings',
        },
      })
    },
  } as const).current
}
