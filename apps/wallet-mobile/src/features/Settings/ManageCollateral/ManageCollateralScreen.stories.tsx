import {storiesOf} from '@storybook/react-native'
import React from 'react'
import {StyleSheet, View} from 'react-native'

import {SelectedWalletProvider} from '../../../SelectedWallet'
import {YoroiWallet} from '../../../yoroi-wallets/cardano/types'
import {mocks} from '../../../yoroi-wallets/mocks'
import {SendProvider} from '../../Send/common/SendContext'
import {ManageCollateralScreen} from './ManageCollateralScreen'

const styles = StyleSheet.create({
  decorator: {
    flex: 1,
  },
})

const goneCollateral: YoroiWallet = {
  ...mocks.wallet,
  utxos: [],
  getCollateralInfo: () => {
    return {
      amount: {
        quantity: '0',
        tokenId: mocks.wallet.primaryTokenInfo.id,
      },
      collateralId: mocks.wallet.collateralId,
      utxo: undefined,
    }
  },
}

const noCollateral: YoroiWallet = {
  ...mocks.wallet,
  collateralId: '',
  getCollateralInfo: () => {
    return {
      amount: {
        quantity: '0',
        tokenId: mocks.wallet.primaryTokenInfo.id,
      },
      collateralId: '',
      utxo: undefined,
    }
  },
}

const noFundsWallet: YoroiWallet = {
  ...mocks.wallet,
  utxos: [],
  collateralId: '',
  getCollateralInfo: () => {
    return {
      amount: {
        quantity: '0',
        tokenId: mocks.wallet.primaryTokenInfo.id,
      },
      collateralId: '',
      utxo: undefined,
    }
  },
}

const withCollateralRemoveLoading: YoroiWallet = {
  ...mocks.wallet,
  setCollateralId: mocks.setCollateralId.loading,
}

storiesOf('ManageCollateralScreen', module)
  .addDecorator((getStory) => (
    <SendProvider>
      <View style={styles.decorator}>{getStory()}</View>
    </SendProvider>
  ))
  .add('with collateral', () => (
    <SelectedWalletProvider wallet={mocks.wallet}>
      <ManageCollateralScreen />
    </SelectedWalletProvider>
  ))
  .add('with collateral - remove loading', () => (
    <SelectedWalletProvider wallet={withCollateralRemoveLoading}>
      <ManageCollateralScreen />
    </SelectedWalletProvider>
  ))
  .add('collateral is gone', () => (
    <SelectedWalletProvider wallet={goneCollateral}>
      <ManageCollateralScreen />
    </SelectedWalletProvider>
  ))
  .add('no collateral', () => (
    <SelectedWalletProvider wallet={noCollateral}>
      <ManageCollateralScreen />
    </SelectedWalletProvider>
  ))
  .add('not enough funds', () => (
    <SelectedWalletProvider wallet={noFundsWallet}>
      <ManageCollateralScreen />
    </SelectedWalletProvider>
  ))
