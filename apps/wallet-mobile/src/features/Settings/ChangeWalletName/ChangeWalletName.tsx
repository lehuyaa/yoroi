import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {defineMessages, useIntl} from 'react-intl'
import {ScrollView, StyleSheet, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'

import {Button, TextInput} from '../../../components'
import globalMessages from '../../../i18n/global-messages'
import {useSelectedWallet} from '../../../SelectedWallet'
import {COLORS} from '../../../theme'
import {isEmptyString} from '../../../utils/utils'
import {useWalletManager} from '../../../WalletManager'
import {useChangeWalletName, useWalletName, useWalletNames} from '../../../yoroi-wallets/hooks'
import {getWalletNameError, validateWalletName} from '../../../yoroi-wallets/utils/validators'

export const ChangeWalletName = () => {
  const strings = useStrings()
  const navigation = useNavigation()

  const wallet = useSelectedWallet()
  const walletName = useWalletName(wallet)
  const {renameWallet, isLoading} = useChangeWalletName(wallet, {onSuccess: () => navigation.goBack()})

  const walletManager = useWalletManager()
  const {walletNames} = useWalletNames(walletManager)
  const [newWalletName, setNewWalletName] = React.useState(walletName ?? '')
  const validationErrors = validateWalletName(newWalletName, walletName ?? null, walletNames || [])
  const hasErrors = Object.keys(validationErrors).length > 0
  const errorText = getWalletNameError(
    {
      tooLong: strings.tooLong,
      nameAlreadyTaken: strings.nameAlreadyTaken,
      mustBeFilled: strings.mustBeFilled,
    },
    validationErrors,
  )

  return (
    <SafeAreaView style={styles.safeAreaView} edges={['left', 'right', 'bottom']}>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.scrollContentContainer}
      >
        <WalletNameInput
          returnKeyType="done"
          errorDelay={0}
          enablesReturnKeyAutomatically
          autoFocus
          label={strings.walletNameInputLabel}
          value={newWalletName}
          onChangeText={(walletName: string) => setNewWalletName(walletName)}
          errorText={!isEmptyString(errorText) ? errorText : undefined}
          autoComplete="off"
        />
      </ScrollView>

      <View style={styles.action}>
        <Button
          onPress={() => {
            if (hasErrors || isEmptyString(newWalletName)) return
            renameWallet(newWalletName.trim())
          }}
          title={strings.changeButton}
          disabled={hasErrors || isLoading}
          shelleyTheme
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: COLORS.BACKGROUND,
    flex: 1,
  },
  scrollContentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  action: {
    padding: 16,
    backgroundColor: COLORS.BACKGROUND,
  },
})

const WalletNameInput = TextInput

const messages = defineMessages({
  changeButton: {
    id: 'components.settings.changewalletname.changeButton',
    defaultMessage: '!!!Change name',
  },
  walletNameInputLabel: {
    id: 'components.settings.changewalletname.walletNameInputLabel',
    defaultMessage: '!!!Wallet name',
  },
})

const useStrings = () => {
  const intl = useIntl()

  return {
    changeButton: intl.formatMessage(messages.changeButton),
    walletNameInputLabel: intl.formatMessage(messages.walletNameInputLabel),
    tooLong: intl.formatMessage(globalMessages.walletNameErrorTooLong),
    nameAlreadyTaken: intl.formatMessage(globalMessages.walletNameErrorNameAlreadyTaken),
    mustBeFilled: intl.formatMessage(globalMessages.walletNameErrorMustBeFilled),
  }
}
