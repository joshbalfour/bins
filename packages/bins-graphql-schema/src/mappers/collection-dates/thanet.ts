import { BinType as ThanetBinType, Collection as ThanetCollection, findCollectionDates } from "@joshbalfour/thanet-api"
import { Address } from "../../entities/address"
import { CollectionDates, BinType } from "./types"
import { notEmpty } from "./utils"

const getBinCollections = (collections: ThanetCollection[], binType: ThanetBinType): ThanetCollection[] => {
  return collections.filter(({ type }) => type === binType)
}

const getLatestCollection = (collections: ThanetCollection[], binType: ThanetBinType): ThanetCollection => {
  return getBinCollections(collections, binType).sort((a, b) => {
    return b.date.getTime() - a.date.getTime()
  }).filter(({ status }) => !!status)[0]
}

const collectionDatesToBins = (collections: ThanetCollection[], addressId: string): CollectionDates[] => {
  // group by bin
  const binDates = new Map<BinType, ThanetCollection[]>()
  binDates.set('General', getBinCollections(collections, 'Refuse'))
  binDates.set('Food', getBinCollections(collections, 'Food'))
  binDates.set('Garden', getBinCollections(collections, 'Garden'))
  binDates.set('Blue Recycling', getBinCollections(collections, 'BlueRecycling'))
  binDates.set('Red recycling', getBinCollections(collections, 'RedRecycling'))

  return [...binDates.keys()].map(type => {
    const ds = binDates.get(type) || []
    const currentStatus = getLatestCollection(collections, ds[0].type)

    const collectionDates = binDates.get(type)?.map(({ date }) => date)
    if (!collectionDates || !collectionDates.length) {
      return undefined
    }
    const binId = `${addressId}-${type}`
    return ({
      type,
      id: binId,
      collections: collectionDates,
      status: currentStatus && currentStatus.status ? {
        outcome: currentStatus.status,
        date: currentStatus.date,
        id: `${binId}-${currentStatus.date.getUTCMilliseconds()}`,
      } : undefined,
    })
  }).filter(notEmpty)
}

export const getCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  const collectionDates = await findCollectionDates(address.data.UPRN)
  return collectionDatesToBins(collectionDates, address.id)
}
