import fetch from 'node-fetch'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { CollectionDates } from './types'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

const offsetDate = (date: Date): Date => {
  const dayJsDate = dayjs(date)
  return dayJsDate.add(dayJsDate.local().utcOffset(), 'minutes').toDate()
}

export const notEmpty = <TValue>(value?: TValue | null): value is TValue => {
  return value !== null && value !== undefined
}

const getDatesFromLine = (html: string) => {
  return html
    .split('<br/>')
    .filter(line => line.includes('-'))
    .map(line => line.split(' : ')[1])
    .filter(notEmpty)
    .map(str => {
      return offsetDate(dayjs(str, 'DD-MMM-YYYY').toDate())
    })
}

const parseHTML = (html: string): CollectionDates[] => {
  const green = html.split('Green Bin (Domestic Waste) details:')[1].split('<strong>')[0]
  const blue = html.split('Blue Bin (Recycling) details:')[1].split('<strong>')[0]
  const brown = html.split('Brown bin (Garden Waste) details:')[1]

  return [
    {
      type: 'Domestic',
      collectionDates: getDatesFromLine(green),
    },
    {
      type: 'Recycling',
      collectionDates: getDatesFromLine(blue),
    },
    {
      type: 'Garden',
      collectionDates: getDatesFromLine(brown),
    }
  ]
}

export const findCollectionDates = async (uprn: string): Promise<CollectionDates[]> => {
  const result = await fetch(`https://community.newcastle.gov.uk/my-neighbourhood/ajax/getBinsNew.php?uprn=${uprn}`);
  const html = await result.text()
  return parseHTML(html)
}
