import { BinType } from "@joshbalfour/bins-types"
import { getReportMissedUrl, reportMissed, BinType as CanterburyBinType } from "@joshbalfour/canterbury-api"
import { Bin, ReportMissedCollection } from "../../entities/bin"
import { getCollectionDates } from "../collection-dates/canterbury"

const validateBinType = (binType: BinType): binType is CanterburyBinType => {
  return binType === "Food" || binType === "Garden" || binType === "General"
}

export const reportMissedCollection = async (bin: Bin, extraInfo: any): Promise<ReportMissedCollection> => {
  const { emailAddress, firstName, lastName } = extraInfo
  if (!emailAddress || !firstName || !lastName) {
    throw new Error('Missing required information')
  }
  const { postcode, firstLine, data } = bin.address
  const { UPRN } = data
  const results = await getCollectionDates(bin.address)
  const binInfo = results.find(b => b.type === bin.type)
  if (!binInfo) {
    throw new Error(`Could not find bin ${bin.id}`)
  }
  if (!binInfo.status) {
    throw new Error(`Bin ${bin.id} has no status`)
  }
  const { workpack } = binInfo.status

  if (!validateBinType(bin.type)) {
    throw new Error(`Bin ${bin.id} has invalid type ${bin.type}`)
  }

  const fallbackUrl = getReportMissedUrl({
    uprn: UPRN,
    workpack,
    bin: bin.type,
    postcode,
    firstLine,
  })

  try {
    await reportMissed({
      uprn: UPRN,
      workpack,
      bin: bin.type,
      postcode,
      firstLine,
      emailAddress,
      firstName,
      lastName,
    })

    return {
      success: true,
      fallbackUrl,
    }
  } catch (e) {
    console.error(e)
  }

  return {
    success: false,
    fallbackUrl,
  }
}
