import {BanxaUnknownError, BanxaValidationError} from '../adapters/errors'
import {banxaModuleMaker} from './module'

describe('banxaModuleMaker', () => {
  test('should generate a correct referral link with all parameters', () => {
    const banxa = banxaModuleMaker({
      partner: 'checkout',
      isProduction: true,
    })
    const fullUrl =
      'https://checkout.banxa.com/?' +
      'sellMode=true' +
      '&' +
      'fiatType=USD' +
      '&' +
      'fiatAmount=500' +
      '&' +
      'coinType=ADA' +
      '&' +
      'coinAmount=800' +
      '&' +
      'blockchain=ADA' +
      '&' +
      'walletAddress=addr1q9v8dvht2mv847gwarl7r4p49yzys8r7zlep7c8t2hqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquvupf' +
      '&' +
      'walletAddressTag=tag'

    const url = banxa.createReferralUrl({
      sellMode: true,
      fiatType: 'USD',
      fiatAmount: 500,
      coinType: 'ADA',
      coinAmount: 800,
      blockchain: 'ADA',
      walletAddress:
        'addr1q9v8dvht2mv847gwarl7r4p49yzys8r7zlep7c8t2hqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquvupf',
      walletAddressTag: 'tag',
    })

    expect(url.toString()).toBe(fullUrl)
  })

  test('should generate a correct referral link with mandatory parameters only', () => {
    const banxa = banxaModuleMaker({
      partner: 'checkout',
      isProduction: true,
    })
    const fullUrl =
      'https://checkout.banxa.com/?' +
      'fiatType=USD' +
      '&' +
      'coinType=ADA' +
      '&' +
      'walletAddress=addr1q9v8dvht2mv847gwarl7r4p49yzys8r7zlep7c8t2hqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquvupf'

    const url = banxa.createReferralUrl({
      fiatType: 'USD',
      coinType: 'ADA',
      walletAddress:
        'addr1q9v8dvht2mv847gwarl7r4p49yzys8r7zlep7c8t2hqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquvupf',
    })

    expect(url.toString()).toBe(fullUrl)
  })

  test('should generate a correct sandbox referral link', () => {
    const banxa = banxaModuleMaker({
      partner: 'checkout',
      isProduction: false,
    })
    const fullUrl =
      'https://checkout.banxa-sandbox.com/?' +
      'fiatType=USD' +
      '&' +
      'coinType=ADA' +
      '&' +
      'walletAddress=addr1q9v8dvht2mv847gwarl7r4p49yzys8r7zlep7c8t2hqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquvupf'

    const url = banxa.createReferralUrl({
      fiatType: 'USD',
      coinType: 'ADA',
      walletAddress:
        'addr1q9v8dvht2mv847gwarl7r4p49yzys8r7zlep7c8t2hqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquvupf',
    })

    expect(url.toString()).toBe(fullUrl)
  })

  test('should not include undefined optional parameters in the referral link', () => {
    const banxa = banxaModuleMaker({
      partner: 'checkout',
      isProduction: true,
    })
    const url = banxa.createReferralUrl({
      fiatType: 'USD',
      coinType: 'ADA',
      walletAddress:
        'addr1q9v8dvht2mv847gwarl7r4p49yzys8r7zlep7c8t2hqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquvupf',
    })
    const urlString = url.toString()
    expect(urlString).not.toContain('sellMode')
    expect(urlString).not.toContain('fiatAmount')
    expect(urlString).not.toContain('coinAmount')
    expect(urlString).not.toContain('blockchain')
    expect(urlString).not.toContain('walletAddressTag')
  })

  test('should throw an BanxaValidationError when schema is invalid', () => {
    const banxa = banxaModuleMaker({
      partner: 'checkout',
      isProduction: true,
    })

    const invalidQueries = {
      fiatType: 'ABC', // Invalid fiatType
      coinType: 'ADA',
      walletAddress:
        'addr1q9v8dvht2mv847gwarl7r4p49yzys8r7zlep7c8t2hqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquvupf',
    }

    expect(() => {
      banxa.createReferralUrl(invalidQueries as any)
    }).toThrow(BanxaValidationError)
  })

  test('should throw an error when ADA walletAddress is not a possible Cardano address', () => {
    const banxa = banxaModuleMaker({
      partner: 'checkout',
      isProduction: true,
    })

    const invalidQueries = {
      fiatType: 'USD',
      coinType: 'ADA',
      walletAddress: 'invalid-cardano-address',
    }

    expect(() => {
      banxa.createReferralUrl(invalidQueries as any)
    }).toThrow(BanxaValidationError)
  })

  test('should throw BanxaUnknownError if is not a BanxaValidationError', () => {
    const banxa = banxaModuleMaker(
      {
        partner: 'checkout',
        isProduction: true,
      },
      {zodErrorTranslator: () => {}},
    )

    const invalidQueries = {
      fiatType: 'XXX',
      coinType: 'XXX',
      walletAddress: 'XXX',
    }

    expect(() => {
      banxa.createReferralUrl(invalidQueries as any)
    }).toThrow(BanxaUnknownError)
  })
})
