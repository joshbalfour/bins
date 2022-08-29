export type BinType = 'recyclingSack' | 'refuseSack' | 'organics' | 'refuseCommunal'
export type CollectionDates = {
  type: BinType
  collectionDates: Date[]
}