export type BinType = 'garden' | 'general' | 'recycling'
export type CollectionDates = {
  type: BinType
  collectionDates: Date[]
}