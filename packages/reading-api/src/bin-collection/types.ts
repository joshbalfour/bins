export type BinType = 'Food' | 'Domestic' | 'Recycling'
export type CollectionDates = {
  type: BinType
  collectionDates: Date[]
}