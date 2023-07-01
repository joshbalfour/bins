import { In, MoreThan, MoreThanOrEqual } from "typeorm"
import { AppDataSource } from "./data-source"
import { Address, Bin, BinCollection, BinStatus } from "./entities"
import { findCollectionDates } from "./mappers/collection-dates"

export const updateAddressData = async (address: Address) => {
  const binRepository = AppDataSource.getRepository(Bin)
  const binCollectionRepository = AppDataSource.getRepository(BinCollection)
  const binStatusRepository = AppDataSource.getRepository(BinStatus)
  const collectionDates = await findCollectionDates(address)
  const statuses: BinStatus[] = []
  const collections: BinCollection[] = []

  // delete bin collections for today onwards for bins we're adding new collection data for
  const now = new Date()
  now.setUTCHours(0,0,0,0)
  await binCollectionRepository.delete({
    binId: In(collectionDates.map(({ id }) => id)),
    date: MoreThanOrEqual(now)
  })

  const storableBins = await Promise.all(collectionDates.map(async (collectionDate) => {
    const cd = binRepository.create({
      id: collectionDate.id,
      type: collectionDate.type,
    })
    if (collectionDate.status) {
      const status = binStatusRepository.create(collectionDate.status)
      status.bin = cd
      statuses.push(status)
    }
    const collectionDates = collectionDate.collections.map(date => 
      binCollectionRepository.create({
        date,
        bin: cd,
      })
    )
    binRepository.merge(cd, {
      address,
    })
    collections.push(...collectionDates)
    return cd
  }))

  await binRepository.save(storableBins)
  await binStatusRepository.save(statuses)
  await binCollectionRepository.save(collections)


  await AppDataSource.getRepository(Address).update(address.id, {
    lastUpdatedAt: new Date(),
  })

  return address
}
