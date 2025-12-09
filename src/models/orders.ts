import type { Product } from './products'

export interface Order {
  id?: string
  buyerId: string
  sellerId?: string
  status: OrderStatus
  totalAmount: number
  products: OrderItem[]
  orderDate?: string
}

export const ORDER_STATUS = ['PREPARING', 'TO_SHIP', 'SHIPPING', 'DELIVERED', 'CANCELED']
export type OrderStatus = (typeof ORDER_STATUS)[number]

export interface OrderItem {
  id?: string
  orderId?: string
  product: Product
  quantity: number
  priceAtPurchase: number
}
