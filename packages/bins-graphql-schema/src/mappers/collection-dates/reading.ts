import { CollectionDates as LACollectionDates, BinType as LABinType, findCollectionDates } from "@joshbalfour/reading-api"
import { BinType } from "@joshbalfour/bins-types"
import { Address } from "../../entities/address"
import { CollectionDates } from "./types"

export const coversAddress = async (address: Address) => {
  const res = await getCollectionDates(address)
  return !!res.length
}

const normaliseBinType = (binType: LABinType): BinType => {
  switch (binType) {
    case 'Domestic':
      return 'General'
    default:
      return binType
  }
}

const laCollectionToCollectionDates = (collection: LACollectionDates, addressId: string): CollectionDates => {
  const binType = normaliseBinType(collection.type)

  return {
    id: `${addressId}-${binType}`,
    type: binType,
    collections: collection.collectionDates,
  }
}

export const getCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  const collectionDates = await findCollectionDates(address.data.UPRN)
  return collectionDates.map(cd => laCollectionToCollectionDates(cd, address.id))
}
