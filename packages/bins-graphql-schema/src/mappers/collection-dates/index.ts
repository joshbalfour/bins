import { AppDataSource } from "../../data-source"
import { Address } from "../../entities/address"
import { CollectionDates } from "./types"
import { getBinRegion } from "../../get-bin-region"

import * as canterbury from './canterbury'
import * as basingstoke from './basingstoke'
import * as birmingham from './birmingham'
import * as bournemouth from './bournemouth'
import * as southampton from './southampton'
import * as aberdeen from './aberdeen'
import * as reading from './reading'
import * as newcastle from './newcastle'
import * as wandsworth from './wandsworth'
import * as southwark from './southwark'
import * as thanet from './thanet'

export const supportedBinRegions = [
  'canterbury',
  'basingstoke-and-deane',
  'birmingham',
  'bournemouth',
  'southampton',
  'aberdeen',
  'newcastle',
  'newcastle-upon-tyne',
  'reading',
  'wandsworth',
  'southwark',
  'thanet',
]


export const findCollectionDates = async (address: Address): Promise<CollectionDates[]> => {
  if (!address.binRegion) {
    const binRegion = await getBinRegion(address.postcode)
    address.binRegion = binRegion
    await AppDataSource.getRepository(Address).save(address)
  }

  if (!address.binRegion) {
    return []
  }

  switch (address.binRegion) {
    case 'canterbury':
      return canterbury.getCollectionDates(address)
    case 'basingstoke':
    case 'basingstoke-and-deane':
      return basingstoke.getCollectionDates(address)
    case 'birmingham':
      return birmingham.getCollectionDates(address)
    case 'bournemouth':
      return bournemouth.getCollectionDates(address)
    case 'southampton':
      return southampton.getCollectionDates(address)
    case 'aberdeen':
      return aberdeen.getCollectionDates(address)
    case 'reading':
      return reading.getCollectionDates(address)
    case 'newcastle':
    case 'newcastle-upon-tyne':
      return newcastle.getCollectionDates(address)
    case 'wandsworth':
      return wandsworth.getCollectionDates(address)
    case 'southwark':
      return southwark.getCollectionDates(address)
    case 'thanet':
      return thanet.getCollectionDates(address)
    default:
      return []
  }
}