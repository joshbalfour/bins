import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { BinType, Collection } from './types'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

const offsetDate = (date: Date): Date => {
  const dayJsDate = dayjs(date)
  return dayJsDate.add(dayJsDate.local().utcOffset(), 'minutes').toDate()
}

type APIResult = {
  id: number
  index: number
  name: string
  nextDate: string
  nextStatus?: string
  previousDate: string
  previousStatus: string
  type: BinType
}

const parseDate = (str: string): Date => {
  return offsetDate(dayjs(str, 'DD/MM/YYYY [at] h:mma').toDate())
}

const normalizeCollections = (result: APIResult): Collection[]  => {
  const nextCollection = {
    date: result.nextDate,
    type: result.type,
    status: result.nextStatus === 'Not Started' ? undefined : result.nextStatus,
  }

  const prevCollection = {
    date: result.previousDate,
    type: result.type,
    status: result.previousStatus,
  }

  return [nextCollection, prevCollection].map(({ date, type, status }) => ({
    date: parseDate(date),
    type,
    status,
  }))
}

export const findCollectionDates = async (uprn: string): Promise<Collection[]> => {
  const result = await fetch(`https://www.thanet.gov.uk/wp-content/mu-plugins/collection-day/incl/mu-collection-day-calls.php?pAddress=${uprn}`)
  const text = await result.text()

  if (text === 'No Results Found') {
    return []
  }
  const data = JSON.parse(text) as APIResult[]

  return data.map(normalizeCollections).flat()
}
