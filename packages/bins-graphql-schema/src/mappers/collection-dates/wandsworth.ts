import { CollectionDates as LACollectionDates, findCollectionDates } from "@joshbalfour/wandsworth-api"
import { Address } from "../../entities/address"
import { CollectionDates } from "./types"

export const coversAddress = async (address: Address) => {
  const res = await getCollectionDates(address)
  return !!res.length
}

const laCollectionToCollectionDates = (collection: LACollectionDates, addressId: string): CollectionDates => {
  const binType = collection.type

  return {
    id: `${addressId}-${binType}`,
    type: binType,
    collections: collection.collectionDates,
  }
}

export const getCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  const collectionDates = await findCollectionDates(address.formatted)
  return collectionDates.map(cd => laCollectionToCollectionDates(cd, address.id))
}
