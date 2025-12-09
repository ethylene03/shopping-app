import type { Cart } from '@/models/carts'
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
    },
    getUserDetails() {
      return {
        id: this.id,
        name: this.name,
        username: this.username,
        role: this.role,
        cart: this.cart,
      } as User
    },
    removeCartItem(id: string) {
      this.cart.products = this.cart.products?.filter((item) => item.id !== id) || []
    },
  },
})
