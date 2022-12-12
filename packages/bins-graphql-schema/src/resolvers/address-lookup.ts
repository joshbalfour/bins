import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { addressLookup } from '@joshbalfour/canterbury-api'
import { toNormalised } from 'postcode'
import { Address } from '../entities/address'
import { Bin } from '../entities/bin'
import { AppDataSource } from '../data-source'
import { updateAddressData } from '../data-update'
import { getBinRegion } from '../get-bin-region'

@Resolver(Address)
export class AddressLookupResolver {
  @Query(() => [Address])
  async addressLookup(@Arg('postcode') postcode: string): Promise<Omit<Address, 'bins'>[]> {
    const addressRepository = AppDataSource.getRepository(Address)
    const normalizedPostcode = toNormalised(postcode)
    if (!normalizedPostcode) {
      throw new Error('Invalid postcode')
    }

    let addresses = await addressRepository.find({
      where: {
        postcode: normalizedPostcode,
      },
    })
    if (!addresses.length){
      const results = await addressLookup(normalizedPostcode)
      const binRegion = await getBinRegion(normalizedPostcode)
      const storableAddresses = results.results
          .map(address => {
            const storableAddress = {
              formatted: address.LPI.ADDRESS,
              postcode: address.LPI.POSTCODE_LOCATOR,
              firstLine: address.LPI.ADDRESS.split(',').slice(0, 2).join(' '),
              data: address.LPI,
              supported: false,
              binRegion,
            }
            return storableAddress
          })
      addresses = await addressRepository.save(addressRepository.create(storableAddresses))
    }
    return addresses
  }

  @Query(() => Address)
  async addressLookupById(@Arg('addressId') addressId: string): Promise<Omit<Address, 'bins'>> {
    const addressRepository = AppDataSource.getRepository(Address)
    const address = await addressRepository.findOne({
      where: {
        id: addressId,
      },
    })
    if (!address) {
      throw new Error('Address not found')
    }
    return address
  }

  @FieldResolver()
  async bins (@Root() address: Address): Promise<Bin[]> {
    // if last updated over 24 hours ago, update the data
    if (!address.lastUpdatedAt || !address.binRegion || Date.now() - (address.lastUpdatedAt?.getTime() ?? 0) > 24 * 60 * 60 * 1000) {
      await updateAddressData(address)
    }

    const binRepository = AppDataSource.getRepository(Bin)

    return binRepository.find({
      where: {
        address: {
          id: address.id,
        }
      },
    })
  }
}
