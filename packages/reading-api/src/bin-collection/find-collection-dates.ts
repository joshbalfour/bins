import fetch from 'node-fetch'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { CollectionDates, BinType } from './types'

dayjs.extend(utc)

const offsetDate = (date: Date): Date => {
  const dayJsDate = dayjs(date)
  return dayJsDate.add(dayJsDate.local().utcOffset(), 'minutes').toDate()
}

type Collection = {
  date: string,
  day: string,
  read_date: string,
  round: string,
  schedule: string
  service: string
}
type APIResult = {
  error_code: number
  error_description: string
  success: boolean
  uprn: string
  collections: Collection[]
}

const normalizeCollection = (collection: Collection) => {
  const binType = collection.service.replace('Collection Service', '').trim().replace('Waste', '').trim() as BinType
  const date = dayjs(collection.date, 'DD/MM/YYYY HH:mm:SS').toDate()

  return {
    binType,
    date: offsetDate(date),
  }
}

export const findCollectionDates = async (uprn: string): Promise<CollectionDates[]> => {
  const result = await fetch(`https://api.reading.gov.uk/api/collections/${uprn}`);
  const data = await result.json() as APIResult

  const collections: Record<BinType, Date[]> = {
    Food: [],
    Domestic: [],
    Recycling: [],
  }
  data.collections.map(normalizeCollection).forEach(({ binType, date }) => {
    if (!collections[binType]) {
      collections[binType] = []
    }
    collections[binType].push(date)
  })

  return Object.entries(collections).map(([binType, collectionDates]) => ({
    type: binType as BinType,
    collectionDates,
  }))
}
