import {UseMutationOptions} from 'react-query'

import {useMutationWithInvalidations} from '../../../yoroi-wallets/hooks'
import {ScanActionClaim} from '../../Scan/common/types'
import {useClaim} from './ClaimProvider'
import {ClaimToken} from './types'

export const useClaimTokens = (options: UseMutationOptions<ClaimToken, Error, ScanActionClaim> = {}) => {
  const {claimTokens, address} = useClaim()
  const mutation = useMutationWithInvalidations<ClaimToken, Error, ScanActionClaim>({
    ...options,
    mutationFn: claimTokens,
    invalidateQueries: [['useClaimTokens', address]],
  })

  return {
    claimTokens: mutation.mutate,

    ...mutation,
  } as const
}
