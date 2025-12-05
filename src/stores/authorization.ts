import type { Cart } from '@/models/carts'
import type { Order } from '@/models/orders'
import type { User, UserToken } from '@/models/users'
import { defineStore } from 'pinia'

export const useAuthorizationStore = defineStore('authorization', {
  state: (): UserToken => ({
    token: '',
    id: '',
    role: 'BUYER',
    name: '',
    username: '',
    cart: {} as Cart,
    orders: [] as Order[],
  }),

  actions: {
    isLoggedIn(): boolean {
      return this.token !== ''
    },
    setUserDetails(response: UserToken) {
      this.id = response.id
      this.role = response.role
      this.name = response.name
      this.username = response.username
      this.token = response.token
      this.cart = response.cart
      this.orders = response.orders
    },
    getUserDetails() {
      return { id: this.id, name: this.name, username: this.username } as User
    },
  },
})
