import {SwapState} from './state'

export const mockSwapStateDefault: SwapState = {
  createOrder: {
    type: 'market',
    address: '',
    datum: '',
    datumHash: '',
    amounts: {
      sell: {
        quantity: '0',
        tokenId: '',
      },
      buy: {
        quantity: '0',
        tokenId: '',
      },
    },
    limitPrice: '0',
    marketPrice: '0',
    slippage: 1,
    selectedPool: {
      provider: 'minswap',
      fee: '',
      tokenA: {tokenId: '', quantity: '0'},
      tokenB: {tokenId: '', quantity: '0'},
      price: 0,
      batcherFee: {tokenId: '', quantity: '0'},
      deposit: {tokenId: '', quantity: '0'},
      poolId: '',
      lastUpdate: '',
      lpToken: {tokenId: '', quantity: '0'},
    },
    calculations: [],
    lpTokenHeld: undefined,
    pools: [],
    ptPrices: {
      sell: '0',
      buy: '0',
    },
  },
  unsignedTx: undefined,
} as const
