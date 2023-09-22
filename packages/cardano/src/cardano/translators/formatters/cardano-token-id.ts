import AssetFingerprint from '@emurgo/cip14-js'
import {Balance} from '@yoroi/types'

/**
 * Calculates the fingerprint of a given token ID based on the Cardano CIP14 standard.
 *
 * The function first calls `getTokenIdentity` to extract the `policyId` and `assetName`
 * from the provided `tokenId`. It then generates the asset fingerprint based on these values.
 *
 * @param {Balance.TokenInfo['id']} tokenId - The token ID used to generate the fingerprint.
 * @returns {Readonly<string>} The calculated fingerprint string.
 * @throws {Error} Throws an error if the policy ID extracted from `tokenId` is invalid or has incorrect length.
 */
export function asFingerprint(tokenId: Balance.TokenInfo['id']): string {
  const {policyId, assetName} = getTokenIdentity(tokenId)

  const assetFingerprint = AssetFingerprint.fromParts(
    Buffer.from(policyId, 'hex'),
    Buffer.from(assetName, 'hex'),
  )

  return assetFingerprint.fingerprint()
}

/**
 * Extracts the identity components of a Cardano token.
 * It parses the provided `tokenId` to extract the `policyId`,
 * `assetName`, and human-readable `name`.
 *
 * The `tokenId` is expected to follow a specific format, usually `policyId.assetName`.
 *
 * @param {Balance.TokenInfo['id']} tokenId - The tokenId string from which to extract information.
 * @returns {Readonly<{policyId: string; name: string; assetName: string}>} An immutable object containing:
 *  - `policyId`: The policy ID of the token.
 *  - `name`: The human-readable name of the asset, derived from its hex-encoded `assetName`.
 *  - `assetName`: The hex-encoded asset name from the tokenId.
 * @throws {Error} Throws an error if the policy ID extracted from `tokenId` is invalid or has incorrect length.
 */
export function getTokenIdentity(
  tokenId: Balance.TokenInfo['id'],
): Readonly<{policyId: string; name: string; assetName: string}> {
  const [policyId, assetName = ''] = tokenId.split('.')

  if (!policyId || policyId.length !== 56) throw new Error('Invalid policyId')

  const name = Buffer.from(assetName, 'hex').toString('utf8')

  return {policyId, assetName, name} as const
}

/**
 * Concatenates the policyId and assetName from a given token ID by removing the separating dot.
 *
 * @param {Balance.TokenInfo['id']} tokenId - The token ID string containing policyId and assetName separated by a dot.
 * @returns {string} A new string formed by removing the separating dot from the tokenId.
 */
export function asSubject(tokenId: Balance.TokenInfo['id']): string {
  return tokenId.replace('.', '')
}
