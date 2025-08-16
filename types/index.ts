
export type Unit = 'g' | 'unit'
export interface Item {
  id: string
  name: string
  quantity: number
  unit: Unit
  imageUrl?: string
  ownerUid: string
  familyId: string
  createdAt: any
  updatedAt: any
}
