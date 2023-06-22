import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { CollectionDates, BinType } from './types'
import * as Cheerio from 'cheerio'

dayjs.extend(customParseFormat)
dayjs.extend(utc)

export const parseHtml = (html: string) => {
  const $ = Cheerio.load(html)
  const outputDiv = $('section.mySouthwarkForm.foundation')
  const bins = $(outputDiv).find('.binProduct')

  const results = [] as any[]

  bins.each((i, bin) => {
    const binType = bin.attribs['aria-labelledby'].split('CollectionTitle')[0] as BinType
    const dates = $(bin).find('p.noMargin')
    const collectionDates = [] as any[]

    dates.each((i, date) => {
      const dateText = $(date).text()
      if (dateText.includes('collection:')) {
        const dayJsDate = dayjs(dateText.split(', ')[1])
        collectionDates.push(offsetDate(dayJsDate.toDate()))
      }
    })

    results.push({
      binType,
      collectionDates,
    })
  })

  return results
}

const offsetDate = (date: Date): Date => {
  const dayJsDate = dayjs(date)
  return dayJsDate.add(dayJsDate.local().utcOffset(), 'minutes').toDate()
}

export const findCollectionDates = async (uprn: string): Promise<CollectionDates[]> => {
  const result = await fetch(`https://www.southwark.gov.uk/bins/lookup/${uprn}`);
  const html = await result.text()

  return parseHtml(html)
}
