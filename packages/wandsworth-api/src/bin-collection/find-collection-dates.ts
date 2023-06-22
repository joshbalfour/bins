import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { CollectionDates, BinType } from './types'

dayjs.extend(utc)

const offsetDate = (date: Date): Date => {
  const dayJsDate = dayjs(date)
  return dayJsDate.add(dayJsDate.local().utcOffset(), 'minutes').toDate()
}

const zeroDate = (date: Date): Date => {
  return dayjs(date).startOf('day').toDate()
}

export const findCollectionDates = async (fullAddress: string): Promise<CollectionDates[]> => {
  const res = await fetch(`https://www.wandsworth.gov.uk/umbraco/api/autocomplete/getcollectiondays`);
  const data = await res.json() as { label: string, value: null }[]
  const result = data.find(({ label }) => fullAddress.toUpperCase().includes(label.toUpperCase()))
  if (!result) {
    return []
  }

  const { label } = result
  const res2 = await fetch(`https://www.wandsworth.gov.uk/rubbish-and-recycling/find-your-recycling-and-waste-collection-day?street=${label}`);
  const html = await res2.text()

  const resultDiv = html.split('<div id="result">')[1].split('</div>')[0]
  if (resultDiv.includes('No streets found')) {
    return []
  }
  const resultText = resultDiv.split('<p>')[1].split('</p>')[0]
  const resultDayOfWeek = resultText.split('<strong>')[1].split('</strong>')[0].toLowerCase().trim()

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]
  const dayNo = days.indexOf(resultDayOfWeek)

  const next = dayjs().day(dayNo).toDate()
  const subsequent = dayjs().day(dayNo).add(1, 'week').toDate()
  const subsequent2 = dayjs().day(dayNo).add(2, 'weeks').toDate()

  const binTypes = ['General', 'Recycling'] as BinType[]

  return binTypes.map(binType => ({
    type: binType,
    collectionDates: [next, subsequent, subsequent2].map(zeroDate).map(offsetDate),
  }))
}

findCollectionDates('MAISONETTE FIRST AND SECOND FLOORS B, 37 AUCKLAND ROAD, LONDON, WANDSWORTH, SW11 1EW').then(console.log).catch(console.error)
