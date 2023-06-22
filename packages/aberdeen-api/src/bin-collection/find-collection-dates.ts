import { generateBody } from './generate-body';
import { CollectionDates, BinType } from './types'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import makeFetchCookie from 'fetch-cookie'
import { getToken } from './get-token';
// import { getCalendarName } from './get-calendar-name';
dayjs.extend(utc)

const offsetDate = (date: Date): Date => {
  const dayJsDate = dayjs(date)
  return dayJsDate.add(dayJsDate.local().utcOffset(), 'minutes').toDate()
}

const parseDate = (str: string): Date => {
  const date = dayjs(str)
  return offsetDate(date.toDate())
}

const getCookies = async (fetch: any) => {
  const res = await fetch('https://integration.aberdeencity.gov.uk/service/bin_collection_calendar___view')
  return res.headers.raw()['set-cookie'] as string[]
}

const getFSNumber = async (fetch: any, sid: string) => {
  const res = await fetch("https://integration.aberdeencity.gov.uk/api/nextref?sid="+sid);
  const data = await res.json()
  return data.data as { reference: string; csrfToken: string }
}

// const getLocation = async (fetch: any, sid: string) => {
//   const res = await fetch("https://integration.aberdeencity.gov.uk/apibroker/location?app_name=AF-Renderer::Self&_=1661716246580&sid="+sid)
//   const data = await res.json()
//   return data
// }

export const findCollectionDates = async (uprn: string): Promise<CollectionDates[]> => {
  const minDate = dayjs().format('YYYY-MM-DD')
  const maxDate = dayjs().add(1, 'year').format('YYYY-MM-DD')

  const fetchC = makeFetchCookie(fetch)
  const cookies = await getCookies(fetchC)
  const [phpsessid] = cookies.filter(c => c.startsWith('PHPSESSID='))
  if (!phpsessid) {
    throw new Error('no php session id')
  }
  const sessionId = phpsessid.split('PHPSESSID=')[1].split(';')[0]
  console.log('sessionId', sessionId)
  const info = await getFSNumber(fetchC, sessionId)
  console.log('info', info)
  const tokens = {
    "port": "",
    "host": "integration.aberdeencity.gov.uk",
    "site_url": "https://integration.aberdeencity.gov.uk/service/bin_collection_calendar___view",
    "site_path": "/service/bin_collection_calendar___view",
    "site_origin": "https://integration.aberdeencity.gov.uk",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
    "site_protocol": "https",
    "session_id": sessionId,
    "product": "Self",
    "formLanguage": "en",
    "isAuthenticated": false,
    "api_url": "https://integration.aberdeencity.gov.uk/apibroker/",
    "transactionReference": "",
    "transaction_status": "",
    "published": true,
    "sectionLength": 1,
    "formUri": "sandbox://AF-Form-86ee3589-39b4-4d00-8383-095c45eed664",
    "publishUri": "sandbox-publish://AF-Process-c34210a1-9f73-467d-8f09-e5e73076c6cd/AF-Stage403ed302-07c5-407d-aae9-0c8b5b297a00/definition.json",
    "formId": "AF-Form-86ee3589-39b4-4d00-8383-095c45eed664",
    "topFormId": "AF-Form-86ee3589-39b4-4d00-8383-095c45eed664",
    "parentFormId": "AF-Form-86ee3589-39b4-4d00-8383-095c45eed664",
    "formName": "Household Waste and Recycling Collection Calendar",
    "topFormName": "Household Waste and Recycling Collection Calendar",
    "parentFormName": "Household Waste and Recycling Collection Calendar",
    "formDescription": "",
    "topFormDescription": "",
    "parentFormDescription": "",
    "case_ref": "FS-Case-"+info.reference.split('FS')[1],
    "stage_id": "AF-Stage403ed302-07c5-407d-aae9-0c8b5b297a00",
    "processId": "AF-Process-c34210a1-9f73-467d-8f09-e5e73076c6cd",
    "stage_name": "Stage 1",
    "processName": "Bin collection calendar - view",
    "stageLength": 1,
    "processDescription": "",
    "processUri": "sandbox-processes://AF-Process-c34210a1-9f73-467d-8f09-e5e73076c6cd",
    "version": "72",
    "csrf_token": info.csrfToken,
    "reference": info.reference,
    "process_prefix": "FS-Case-",
  }
  const token = await getToken(fetchC, sessionId, info.reference, tokens)
  const body = generateBody(uprn, sessionId, '', minDate, maxDate, token, tokens)
  const res = await fetchC("https://integration.aberdeencity.gov.uk/apibroker/runLookup?id=5a3141caf4016&repeat_against=&noRetry=true&getOnlyTokens=undefined&log_id=&app_name=AF-Renderer::Self&sid="+sessionId, {
    headers: {
      "content-type": "application/json",
    },
    "method": "POST",
    body: JSON.stringify(body),
  });

  const result = await res.json();

  if (result?.result === 'logout') {
    throw new Error('session error')
  }


  const binTypes: BinType[] = ['garden', 'general', 'recycling']
  const data = result?.integration?.transformed?.rows_data
  if (!data) {
    return []
  }

  const row = data[0] as Record<string, string>

  const collectionDates: Record<BinType, Date[]> = {
    garden: [],
    general: [],
    recycling: [],
  }

  Object.entries(row).forEach(([key, value]) => {
    const k = key.toLowerCase()
    const binType = binTypes.find((binType) => k.startsWith(binType))
    if (!binType) {
      return undefined
    }
    if (!collectionDates[binType]) {
      collectionDates[binType] = []
    }
    collectionDates[binType].push(parseDate(value))
  })
  return Object.entries(collectionDates)
    .map(([type, collectionDates]) => ({
      type: type as BinType,
      collectionDates,
    }))
}
