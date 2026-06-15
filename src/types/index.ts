export const OrderStatus = {
  Pending:   0,
  Shipped:   1,
  Delivered: 2,
  Cancelled: 3,
} as const

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]

export interface Address {
  zipCode: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
}

export interface Order {
  id: string
  orderNumber: string
  description: string
  amount: number
  deliveryAddress: Address
  status: OrderStatus
  userId: string
  createdAt: string
}

export interface AppNotification {
  id: string
  message: string
  orderId: string
  isRead: boolean
  createdAt: string
  readAt: string | null
}