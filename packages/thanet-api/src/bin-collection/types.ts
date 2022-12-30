export type BinType = 'Refuse' | 'RedRecycling' | 'BlueRecycling' | 'Food' | 'Garden'
export type Collection = {
  date: Date
  type: BinType
  status?: string
}