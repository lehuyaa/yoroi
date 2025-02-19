/* eslint-disable @typescript-eslint/require-await */
import {act, render} from '@testing-library/react-native'
import * as React from 'react'
import {Text, View} from 'react-native'

import {Ampli} from './ampli'
import {makeMetricsManager, MetricsProvider, useMetrics} from './metricsManager'
import {mockMetricsManager} from './mocks'

const initialMockedMetricsManager = mockMetricsManager()

jest.useFakeTimers()

const TestInit = () => {
  const {isLoaded} = useMetrics()

  return (
    <View>
      <Text>{isLoaded ? 'Loaded' : 'Not Loaded'}</Text>
    </View>
  )
}

describe('MetricsProvider', () => {
  it('should initialize the module while mounting', async () => {
    const metricsManager = {...initialMockedMetricsManager, init: jest.fn(), enabled: jest.fn()}
    const {findByText} = render(
      <MetricsProvider metricsManager={metricsManager}>
        <TestInit />
      </MetricsProvider>,
    )

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    expect(await findByText('Loaded')).toBeTruthy()
    expect(metricsManager.init).toHaveBeenCalled()
    expect(metricsManager.enabled).toHaveBeenCalled()
  })
})

const mockAmpli = {
  load: jest.fn().mockReturnValue({promise: Promise.resolve()}),
  client: {
    setOptOut: jest.fn(),
  },
  flush: jest.fn().mockReturnValue({promise: Promise.resolve()}),
  isLoaded: false,

  nftGalleryDetailsTab: jest.fn(),
  nftGalleryPageViewed: jest.fn(),
  nftGallerySearchActivated: jest.fn(),
  nftGalleryDetailsPageViewed: jest.fn(),
  nftGalleryDetailsImageViewed: jest.fn(),

  sendInitiated: jest.fn(),
  sendSelectAssetPageViewed: jest.fn(),
  sendSelectAssetSelected: jest.fn(),
  sendSelectAssetUpdated: jest.fn(),
  sendSummaryPageViewed: jest.fn(),
  sendSummarySubmitted: jest.fn(),

  swapInitiated: jest.fn(),
  swapPoolChanged: jest.fn(),
  swapOrderSelected: jest.fn(),
  swapAssetToChanged: jest.fn(),
  swapOrderSubmitted: jest.fn(),
  swapSlippageChanged: jest.fn(),
  swapAssetFromChanged: jest.fn(),
  swapConfirmedPageViewed: jest.fn(),
  swapCancelationSubmitted: jest.fn(),

  walletPageExchangeClicked: jest.fn(),
  walletPageExchangeBottomSheetClicked: jest.fn(),
} as unknown as Ampli

const mockMetricsStorage = {
  enabled: {
    read: jest.fn().mockResolvedValue(true),
    write: jest.fn().mockResolvedValue(undefined),
  },
  consentRequested: {
    read: jest.fn().mockResolvedValue(false),
    write: jest.fn().mockResolvedValue(undefined),
  },
}

describe('makeMetricsManager', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('init should initialize metricsModule with the correct environment and enabled status', async () => {
    const metricsManager = makeMetricsManager(mockMetricsStorage, mockAmpli)

    expect(await metricsManager.enabled()).toBe(true)
    await metricsManager.init()

    expect(mockAmpli.load).toHaveBeenCalledWith({
      environment: 'development',
      client: {
        configuration: {optOut: false, flushIntervalMillis: expect.any(Number), trackingOptions: {ipAddress: false}},
      },
    })
  })

  test('init should do nothing if it was loaded already', async () => {
    const mockAmpliLoaded = {...mockAmpli, isLoaded: true} as unknown as Ampli
    const metricsManager = makeMetricsManager(mockMetricsStorage, mockAmpliLoaded)

    expect(await metricsManager.enabled()).toBe(true)
    await metricsManager.init()

    expect(mockAmpliLoaded.load).toHaveBeenCalledTimes(0)
  })

  test('track should call the appropriate metricsModule methods', () => {
    const metricsManager = makeMetricsManager(mockMetricsStorage, mockAmpli)
    const mockSendPayload = {asset_count: 10, nfts: [], tokens: []}

    metricsManager.track.nftGalleryDetailsTab({nft_tab: 'Metadata'})
    metricsManager.track.nftGalleryPageViewed({nft_count: 10})
    metricsManager.track.nftGallerySearchActivated({nft_search_term: 'test', nft_count: 10})
    metricsManager.track.nftGalleryDetailsPageViewed()
    metricsManager.track.nftGalleryDetailsImageViewed()

    metricsManager.track.sendInitiated()
    metricsManager.track.sendSelectAssetPageViewed()
    metricsManager.track.sendSelectAssetSelected(mockSendPayload)
    metricsManager.track.sendSelectAssetUpdated(mockSendPayload)
    metricsManager.track.sendSummaryPageViewed(mockSendPayload)
    metricsManager.track.sendSummarySubmitted(mockSendPayload)

    metricsManager.track.swapInitiated({
      from_asset: [{asset_name: 'ADA', asset_ticker: 'ADA', policy_id: '12345'}],
      to_asset: [{asset_name: 'DOGE', asset_ticker: 'DOGE', policy_id: '65432'}],
      order_type: 'limit',
      slippage_tolerance: 1,
    })
    metricsManager.track.swapSlippageChanged({
      slippage_tolerance: 1,
    })
    metricsManager.track.swapPoolChanged()
    metricsManager.track.swapOrderSelected({
      from_asset: [{asset_name: 'ADA', asset_ticker: 'ADA', policy_id: '12345'}],
      to_asset: [{asset_name: 'DOGE', asset_ticker: 'DOGE', policy_id: '65432'}],
      order_type: 'limit',
      slippage_tolerance: 1,
      from_amount: '12',
      to_amount: '31',
      pool_source: 'fake-pool',
      swap_fees: 1,
    })
    metricsManager.track.swapAssetFromChanged({
      from_asset: [{asset_name: 'ADA', asset_ticker: 'ADA', policy_id: '12345'}],
    })
    metricsManager.track.swapAssetToChanged({
      to_asset: [{asset_name: 'DOGE', asset_ticker: 'DOGE', policy_id: '65432'}],
    })

    metricsManager.track.walletPageExchangeClicked()
    metricsManager.track.walletPageExchangeBottomSheetClicked()

    expect(mockAmpli.nftGalleryDetailsTab).toHaveBeenCalledWith({nft_tab: 'Metadata'})
    expect(mockAmpli.nftGalleryPageViewed).toHaveBeenCalledWith({nft_count: 10})
    expect(mockAmpli.nftGallerySearchActivated).toHaveBeenCalledWith({nft_search_term: 'test', nft_count: 10})
    expect(mockAmpli.nftGalleryDetailsPageViewed).toHaveBeenCalled()
    expect(mockAmpli.nftGalleryDetailsImageViewed).toHaveBeenCalled()

    expect(mockAmpli.sendInitiated).toHaveBeenCalled()
    expect(mockAmpli.sendSelectAssetPageViewed).toHaveBeenCalled()
    expect(mockAmpli.sendSelectAssetSelected).toHaveBeenCalledWith(mockSendPayload)
    expect(mockAmpli.sendSelectAssetUpdated).toHaveBeenCalledWith(mockSendPayload)
    expect(mockAmpli.sendSummaryPageViewed).toHaveBeenCalledWith(mockSendPayload)
    expect(mockAmpli.sendSummarySubmitted).toHaveBeenCalledWith(mockSendPayload)

    expect(mockAmpli.swapInitiated).toHaveBeenCalledWith({
      from_asset: [{asset_name: 'ADA', asset_ticker: 'ADA', policy_id: '12345'}],
      to_asset: [{asset_name: 'DOGE', asset_ticker: 'DOGE', policy_id: '65432'}],
      order_type: 'limit',
      slippage_tolerance: 1,
    })
    expect(mockAmpli.swapSlippageChanged).toHaveBeenCalledWith({
      slippage_tolerance: 1,
    })
    expect(mockAmpli.swapPoolChanged).toHaveBeenCalled()
    expect(mockAmpli.swapOrderSelected).toHaveBeenCalledWith({
      from_asset: [{asset_name: 'ADA', asset_ticker: 'ADA', policy_id: '12345'}],
      to_asset: [{asset_name: 'DOGE', asset_ticker: 'DOGE', policy_id: '65432'}],
      order_type: 'limit',
      slippage_tolerance: 1,
      from_amount: '12',
      to_amount: '31',
      pool_source: 'fake-pool',
      swap_fees: 1,
    })
    expect(mockAmpli.swapAssetFromChanged).toHaveBeenCalledWith({
      from_asset: [{asset_name: 'ADA', asset_ticker: 'ADA', policy_id: '12345'}],
    })
    expect(mockAmpli.swapAssetToChanged).toHaveBeenCalledWith({
      to_asset: [{asset_name: 'DOGE', asset_ticker: 'DOGE', policy_id: '65432'}],
    })

    expect(mockAmpli.walletPageExchangeClicked).toHaveBeenCalled()
    expect(mockAmpli.walletPageExchangeBottomSheetClicked).toHaveBeenCalled()
  })

  test('enable should set metrics enabled to true', async () => {
    const metricsManager = makeMetricsManager(mockMetricsStorage, mockAmpli)
    await metricsManager.enable()
    expect(await metricsManager.enabled()).toBe(true)
    expect(mockMetricsStorage.enabled.write).toHaveBeenCalledWith(true)
    expect(mockAmpli.client.setOptOut).toHaveBeenCalledWith(false)
  })

  test('disable should set metrics enabled to false', async () => {
    const mockMetricsStorageDisabled = {
      enabled: {
        read: jest.fn().mockResolvedValue(false),
        write: jest.fn().mockResolvedValue(undefined),
      },
      consentRequested: {
        read: jest.fn().mockResolvedValue(false),
        write: jest.fn().mockResolvedValue(undefined),
      },
    }
    const metricsManager = makeMetricsManager(mockMetricsStorageDisabled, mockAmpli)
    await metricsManager.disable()
    expect(await metricsManager.enabled()).toBe(false)
    expect(mockMetricsStorageDisabled.enabled.write).toHaveBeenCalledWith(false)
    expect(mockAmpli.client.setOptOut).toHaveBeenCalledWith(true)
    expect(mockAmpli.flush).toHaveBeenCalled()
  })
})
