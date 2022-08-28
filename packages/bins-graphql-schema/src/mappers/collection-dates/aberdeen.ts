import { BinCollection, findCollectionDates, BinType as AberdeenBinType } from "@joshbalfour/basingstoke-api"
import { BinType } from "@joshbalfour/bins-types"
import { Address } from "../../entities/address"
import { CollectionDates } from "./types"

const normaliseBinType = (binType: AberdeenBinType): BinType => {
  if (binType === 'Refuse') {
    return 'General'
  }

  if (binType === 'GardenWaste') {
    return 'Garden'
  }

  return binType
}

const normalizeCollectionDates = (collection: BinCollection, addressId: string): CollectionDates => {
  const { collectionDates } = collection
  const binType = normaliseBinType(collection.binType)

  return {
    id: `${addressId}-${binType}`,
    type: binType,
    collections: collectionDates,
  }
}

export const getCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  const collectionDates = await findCollectionDates(address.data.UPRN)
  return collectionDates.map(cd => normalizeCollectionDates(cd, address.id))
}
