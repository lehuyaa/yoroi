import {storiesOf} from '@storybook/react-native'
import {mockSwapManager, SwapProvider} from '@yoroi/swap'
import React from 'react'

import {QueryProvider} from '../../../../../../.storybook/decorators'
import {Boundary} from '../../../../../components'
import {SearchProvider} from '../../../../../Search/SearchContext'
import {SelectedWalletProvider} from '../../../../../SelectedWallet'
import {mocks} from '../../../../../yoroi-wallets/mocks/wallet'
import {SwapTouchedProvider} from '../CreateOrder/TouchedContext'
import {OpenOrders, OpenOrdersSkeleton} from './OpenOrders'

storiesOf('Swap Open orders', module)
  .add('Default', () => {
    return (
      <QueryProvider>
        <SelectedWalletProvider wallet={mocks.wallet}>
          <SearchProvider>
            <SwapProvider swapManager={mockSwapManager}>
              <SwapTouchedProvider>
                <OpenOrders />
              </SwapTouchedProvider>
            </SwapProvider>
          </SearchProvider>
        </SelectedWalletProvider>
      </QueryProvider>
    )
  })
  .add('Loading', () => {
    return (
      <QueryProvider>
        <SelectedWalletProvider wallet={mocks.wallet}>
          <SearchProvider>
            <SwapProvider
              swapManager={{
                ...mockSwapManager,
                order: {
                  ...mockSwapManager.order,
                  list: {
                    ...mockSwapManager.order.list,
                    byStatusOpen: () => new Promise(() => undefined),
                  },
                },
              }}
            >
              <SwapTouchedProvider>
                <Boundary loading={{fallback: <OpenOrdersSkeleton />}}>
                  <OpenOrders />
                </Boundary>
              </SwapTouchedProvider>
            </SwapProvider>
          </SearchProvider>
        </SelectedWalletProvider>
      </QueryProvider>
    )
  })
