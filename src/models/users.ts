import type { Cart } from './carts'
import type { Order } from './orders'

export interface UserToken {
  id: string
  name: string
  username: string
  role: 'BUYER' | 'SELLER'
  token: string
  cart: Cart
  orders: Order[]
}

export type User = Omit<UserToken, 'token'>
export type UserProfile = Partial<UserCredentials> & { newPassword?: string }

export type UserPasswordChange = {
  username: string
  oldPassword: string
  newPassword: string
}

export interface UserCredentials {
  name?: string
  username: string
  password: string
  role?: 'BUYER' | 'SELLER'
}

export interface UserList {
  total: number
  pages: number
  page: number
  size: number
  data: User[]
}
