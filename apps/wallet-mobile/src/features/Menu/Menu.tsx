import {defineMessage} from '@formatjs/intl'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {useIntl} from 'react-intl'
import {Linking, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'

import {useCanVote} from '../../Catalyst/hooks'
import {InsufficientFundsModal} from '../../Catalyst/InsufficientFundsModal'
import {Boundary, Icon, Spacer, Text} from '../../components'
import {Hr} from '../../components/Hr'
import {usePrefetchStakingInfo} from '../../Dashboard/StakePoolInfos'
import {defaultStackNavigationOptions, useWalletNavigation} from '../../navigation'
import {useSelectedWallet} from '../../SelectedWallet'
import {lightPalette} from '../../theme'

const MenuStack = createStackNavigator()

export const MenuNavigator = () => {
  const strings = useStrings()

  return (
    <MenuStack.Navigator
      initialRouteName="_menu"
      screenOptions={{
        ...defaultStackNavigationOptions,
        headerLeft: () => null,
        detachPreviousScreen: false /* https://github.com/react-navigation/react-navigation/issues/9883 */,
      }}
    >
      <MenuStack.Screen name="_menu" component={Menu} options={{title: strings.menu}} />
    </MenuStack.Navigator>
  )
}

export const Menu = () => {
  const strings = useStrings()
  const navigateTo = useNavigateTo()

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} bounces={false}>
        <AppSettings //
          label={strings.settings}
          onPress={navigateTo.settings}
          left={<Icon.Gear size={24} color={lightPalette.gray['600']} />}
        />

        <Hr />

        <Boundary loading={{size: 'small', style: {padding: 16}}} error={{size: 'inline'}}>
          <Catalyst //
            label={strings.catalystVoting}
            onPress={navigateTo.catalystVoting}
            left={<Icon.Catalyst size={24} color={lightPalette.gray['600']} />}
          />
        </Boundary>

        <Hr />

        <KnowledgeBase //
          label={strings.knowledgeBase}
          onPress={navigateTo.knowledgeBase}
          left={<Icon.Info size={24} color={lightPalette.gray['600']} />}
        />

        <Hr />

        <Spacer fill />

        <SupportLink />
      </ScrollView>
    </SafeAreaView>
  )
}

const SupportLink = () => {
  const strings = useStrings()
  const navigateTo = useNavigateTo()

  return (
    <View style={styles.support}>
      <View style={styles.supportTitle}>
        <Text style={styles.supportTitleText}>{strings.supportTitle}</Text>
      </View>

      <Spacer height={10} />

      <TouchableOpacity onPress={navigateTo.support} style={styles.supportLink}>
        <Icon.Support size={24} color="#4B6DDE" />

        <Spacer width={10} />

        <Text bold style={styles.supportLinkText}>
          {strings.supportLink.toLocaleUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const Item = ({
  label,
  left,
  right,
  disabled = false,
  onPress,
}: {
  label: string
  left: React.ReactElement
  disabled?: boolean
  right?: React.ReactElement | null
  onPress: () => void
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item} disabled={disabled}>
      {left}

      <Spacer width={12} />

      <Text style={{fontFamily: 'Rubik-Medium', fontSize: 16, lineHeight: 24, color: lightPalette.gray['900']}}>
        {label}
      </Text>

      <Spacer fill />

      {right}

      <Spacer width={8} />

      <Icon.Chevron direction="right" size={28} color={lightPalette.gray['600']} />
    </TouchableOpacity>
  )
}

const AppSettings = Item
const KnowledgeBase = Item
const Catalyst = ({label, left, onPress}: {label: string; left: React.ReactElement; onPress: () => void}) => {
  const wallet = useSelectedWallet()
  const {canVote, sufficientFunds} = useCanVote(wallet)

  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = React.useState(false)

  return (
    <>
      <Item
        label={label}
        onPress={() => (sufficientFunds ? onPress() : setShowInsufficientFundsModal(true))}
        left={left}
        disabled={!canVote}
      />

      <InsufficientFundsModal
        visible={showInsufficientFundsModal}
        onRequestClose={() => setShowInsufficientFundsModal(false)}
      />
    </>
  )
}

const SUPPORT_TICKET_LINK = 'https://emurgohelpdesk.zendesk.com/hc/en-us/requests/new?ticket_form_id=360013330335'
const KNOWLEDGE_BASE_LINK = 'https://emurgohelpdesk.zendesk.com/hc/en-us/categories/4412619927695-Yoroi'

const useNavigateTo = () => {
  const {navigation, navigateToSettings} = useWalletNavigation()
  const wallet = useSelectedWallet()
  const prefetchStakingInfo = usePrefetchStakingInfo(wallet)

  return {
    allWallets: () => navigation.navigate('app-root', {screen: 'wallet-selection'}),
    catalystVoting: () => {
      prefetchStakingInfo()

      navigation.navigate('app-root', {
        screen: 'voting-registration',
        params: {
          screen: 'download-catalyst',
        },
      })
    },
    settings: () => navigateToSettings(),
    support: () => Linking.openURL(SUPPORT_TICKET_LINK),
    knowledgeBase: () => Linking.openURL(KNOWLEDGE_BASE_LINK),
  }
}

const useStrings = () => {
  const intl = useIntl()

  return {
    catalystVoting: intl.formatMessage(messages.catalystVoting),
    settings: intl.formatMessage(messages.settings),
    supportTitle: intl.formatMessage(messages.supportTitle),
    supportLink: intl.formatMessage(messages.supportLink),
    knowledgeBase: intl.formatMessage(messages.knowledgeBase),
    menu: intl.formatMessage(messages.menu),
    releases: intl.formatMessage(messages.releases),
  }
}

const messages = defineMessage({
  catalystVoting: {
    id: 'menu.catalystVoting',
    defaultMessage: '!!!Catalyst voting',
  },
  settings: {
    id: 'menu.settings',
    defaultMessage: '!!!Settings',
  },
  supportTitle: {
    id: 'menu.supportTitle',
    defaultMessage: '!!!Any questions',
  },
  supportLink: {
    id: 'menu.supportLink',
    defaultMessage: '!!!Ask our support team',
  },
  knowledgeBase: {
    id: 'menu.knowledgeBase',
    defaultMessage: '!!!Knowledge base',
  },
  menu: {
    id: 'menu',
    defaultMessage: '!!!Menu',
  },
  releases: {
    id: 'menu.releases',
    defaultMessage: '!!!Releases',
  },
})

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    justifyContent: 'center',
  },
  scrollViewContent: {
    flex: 1,
    padding: 16,
  },
  support: {
    alignItems: 'center',
  },
  supportTitle: {
    justifyContent: 'center',
  },
  supportTitleText: {
    color: '#6B7384',
  },
  supportLink: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  supportLinkText: {
    color: '#4B6DDE',
  },
})
