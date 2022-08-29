export type BinType = 'Garden' | 'Domestic' | 'Recycling'
export type CollectionDates = {
  type: BinType
  collectionDates: Date[]
}