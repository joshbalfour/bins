import { BinType, binTypes, CollectionDates, findCollectionDates } from "@joshbalfour/canterbury-api"
import { Address } from "../../entities/address"

export const notEmpty = <TValue>(value?: TValue | null): value is TValue => {
  return value !== null && value !== undefined
}

const collectionDatesToBins = (binInfo: CollectionDates, addressId: string) => {
  // group by bin
  const { dates, status } = binInfo
  const { blackBinDay, foodBinDay, gardenBinDay, recyclingBinDay } = dates
  const binDates = new Map<BinType, Date[]>()
  binDates.set('General', blackBinDay)
  binDates.set('Food', foodBinDay)
  binDates.set('Garden', gardenBinDay)
  binDates.set('Recycling', recyclingBinDay)

  return binTypes.map(type => {
    const statuses = status?.streetStatus.filter(s => s.type === type)
    const [currentStatus] = statuses?.sort((a, b) => {
      return b.date.getTime() - a.date.getTime()
    }) || []

    const collectionDates = binDates.get(type)
    if (!collectionDates || !collectionDates.length) {
      return undefined
    }
    const binId = `${addressId}-${type}`
    return ({
      type,
      id: binId,
      collections: collectionDates,
      status: currentStatus && {
        outcome: currentStatus.outcome,
        date: currentStatus.date,
        workpack: currentStatus.workpack,
        id: `${binId}-${currentStatus.workpack}`,
      },
    })
  }).filter(notEmpty)
}

export const getCollectionDates = async (address: Address) => {
  const collectionDates = await findCollectionDates(address.data.UPRN, address.data.USRN)
  return collectionDatesToBins(collectionDates, address.id)
}