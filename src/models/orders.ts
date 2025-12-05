import type { Product } from './products'

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  totalAmount: number
  products: OrderItem[]
}

export type OrderStatus = 'PREPARING' | 'TO_SHIP' | 'SHIPPING' | 'DELIVERED' | 'CANCELED'

export interface OrderItem {
  id: string
  orderId: string
  product: Product
  quantity: number
  priceAtPurchase: number
}
