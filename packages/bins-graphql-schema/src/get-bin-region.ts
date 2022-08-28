import fetch from 'node-fetch'

export const getBinRegion = async (postcode: string) => {
  const url = 'https://www.gov.uk/find-local-council'
  const res = await fetch(url, {
    body: `postcode=${postcode}`,
    method: 'POST',
    redirect: 'manual',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  })
  if (res.status !== 302) {
    return undefined
  }
  const districtCouncil = res.headers.get('location')?.replace(`${url}/`, '')
  return districtCouncil
}