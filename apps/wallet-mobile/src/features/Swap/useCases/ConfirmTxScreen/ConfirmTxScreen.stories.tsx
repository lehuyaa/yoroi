import {storiesOf} from '@storybook/react-native'
import {mockSwapManager, mockSwapStateDefault, SwapProvider} from '@yoroi/swap'
import React from 'react'

import {SelectedWalletProvider} from '../../../../SelectedWallet'
import {mocks as walletMocks} from '../../../../yoroi-wallets/mocks'
import {mocks} from '../../common/mocks'
import {SwapFormProvider} from '../StartSwapScreen/CreateOrder/TouchedContext'
import {ConfirmTxScreen} from './ConfirmTxScreen'

storiesOf('Swap ConfirmTxScreen', module) //
  .add('swap confirm tx: with password', () => {
    return <ConfirmTxWithPasswaordScreen />
  })
  .add('swap confirm tx: with os', () => {
    return <ConfirmTxWithOSScreen />
  })

const ConfirmTxWithPasswaordScreen = () => {
  return (
    <SelectedWalletProvider wallet={{...walletMocks.wallet}}>
      <SwapProvider
        initialState={{
          ...mockSwapStateDefault,
          unsignedTx: walletMocks.yoroiUnsignedTx,
          createOrder: {...mocks.confirmTx.createOrder},
        }}
        swapManager={{
          ...mockSwapManager,
        }}
      >
        <SwapFormProvider>
          <ConfirmTxScreen />
        </SwapFormProvider>
      </SwapProvider>
    </SelectedWalletProvider>
  )
}
const ConfirmTxWithOSScreen = () => {
  return (
    <SelectedWalletProvider wallet={{...walletMocks.wallet, isEasyConfirmationEnabled: true}}>
      <SwapProvider
        initialState={{
          ...mockSwapStateDefault,
          unsignedTx: walletMocks.yoroiUnsignedTx,
          createOrder: {...mocks.confirmTx.createOrder},
        }}
        swapManager={{
          ...mockSwapManager,
        }}
      >
        <SwapFormProvider>
          <ConfirmTxScreen />
        </SwapFormProvider>
      </SwapProvider>
    </SelectedWalletProvider>
  )
}
