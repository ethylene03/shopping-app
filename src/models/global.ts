import type { Order, OrderItem } from './orders'
import type { Product } from './products'

export interface ApiError {
  error: string[]
}

export interface Page {
  content: Product[] | Order[] | OrderItem[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  size: number
  totalElements: number
  totalPages: number
}
