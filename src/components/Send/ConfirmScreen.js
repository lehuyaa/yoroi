// @flow

import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {View, TouchableHighlight} from 'react-native'
import {withHandlers} from 'recompose'

import CustomText from '../CustomText'
import {authenticate} from '../../helpers/bioAuthHelper'

import {COLORS} from '../../styles/config'
import styles from './styles/ConfirmScreen.style'

import type {SubTranslation} from '../../l10n/typeHelpers'

const getTrans = (state) => state.trans.ConfirmSendScreen

type Props = {
  onConfirm: () => mixed,
  trans: SubTranslation<typeof getTrans>
}

const ConfirmScreen = ({onConfirm, trans}: Props) => (
  <View style={styles.container}>
    <CustomText style={styles.welcome}>
    Confirm your transaction
    </CustomText>

    <TouchableHighlight
      style={styles.button}
      activeOpacity={0.9}
      underlayColor={COLORS.WHITE}
      onPress={onConfirm}
    >
      <View style={styles.continueButton}>
        <CustomText style={styles.continueButtonText}>{trans.confirm}</CustomText>
      </View>
    </TouchableHighlight>
  </View>
)


export default compose(
  connect((state) => ({
    trans: getTrans(state),
  })),
  withHandlers({
    // TODO(ppershing): this should validate only on confirm
    onConfirm: ({navigation}) => (event) =>
      (authenticate().then((success) => (success ? navigation.popToTop() : null))),
  })
)(ConfirmScreen)
