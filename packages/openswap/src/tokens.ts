import {SWAP_API_ENDPOINTS} from './config'
import type {ApiDeps, TokenResponse} from './types'

export async function getTokens(
  deps: ApiDeps,
  {policyId = '', assetName = ''} = {},
): Promise<TokenResponse> {
  const {network, client} = deps
  if (network === 'preprod') return []

  const apiUrl = SWAP_API_ENDPOINTS[network].getTokens
  const response = await client.get<TokenResponse>('', {
    baseURL: apiUrl,
    params: {
      'base-policy-id': policyId,
      'base-tokenname': assetName,
    },
  })

  if (response.status !== 200) {
    throw new Error('Failed to fetch tokens', {cause: response.data})
  }

  return response.data
}
