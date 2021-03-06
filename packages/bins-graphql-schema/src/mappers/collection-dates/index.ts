import { AppDataSource } from "../../data-source"
import { Address, BinRegion } from "../../entities/address"

import * as canterbury from './canterbury'
import * as basingstoke from './basingstoke'
import * as birmingham from './birmingham'
import * as bournemouth from './bournemouth'
import * as southampton from './southampton'

import { CollectionDates } from "./types"
import { notEmpty } from "./utils"

const returnOrFail = async (region: BinRegion, fn: () => Promise<boolean>) => {
  try {
    const result = await fn()
    if (result) {
      return region
    }
  } catch (e) {
    return undefined
  }
}

const findBinRegion = async (address: Address): Promise<BinRegion | undefined> => {
  const res = await Promise.all([
    returnOrFail('canterbury', () => canterbury.coversAddress(address)),
    returnOrFail('basingstoke', () => basingstoke.coversAddress(address)),
    returnOrFail('birmingham', () => birmingham.coversAddress(address)),
    returnOrFail('bournemouth', () => bournemouth.coversAddress(address)),
    returnOrFail('southampton', () => southampton.coversAddress(address)),
  ])

  return res.filter(notEmpty)[0]
}

export const findCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  if (!address.binRegion) {
    const binRegion = await findBinRegion(address)
    address.binRegion = binRegion
    await AppDataSource.getRepository(Address).save(address)
  }

  switch (address.binRegion) {
    case 'canterbury':
      return canterbury.getCollectionDates(address)
    case 'basingstoke':
      return basingstoke.getCollectionDates(address)
    case 'birmingham':
      return birmingham.getCollectionDates(address)
    case 'bournemouth':
      return bournemouth.getCollectionDates(address)
    case 'southampton':
      return southampton.getCollectionDates(address)
    default:
      return []
  }
}