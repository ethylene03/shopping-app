import type { Product } from "./products"

export interface Cart {
  id: string
  userId: string
  totalAmount: number
  products: CartItem[]
}

export interface CartItem {
  id: string
  cartId: string
  product: Product
  quantity: number
}
