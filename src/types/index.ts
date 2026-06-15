// Enums

export const OrderStatus = {
  Pending:   'Pending',
  Shipped:   'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
} as const

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]

export const NotificationType = {
  OrderRegistered: 'OrderRegistered',
  OrderDelivered:  'OrderDelivered',
} as const

export type NotificationType = typeof NotificationType[keyof typeof NotificationType]

// Domain 

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
  type: NotificationType
  isRead: boolean
  createdAt: string
  readAt: string | null
}