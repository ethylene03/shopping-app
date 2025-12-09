import type { CartItem } from '@/models/carts'
import { defineStore } from 'pinia'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    items: [] as CartItem[],
  }),
  actions: {
    setItems(cartItems: CartItem[]) {
      this.items = cartItems
      localStorage.setItem('checkoutItems', JSON.stringify(cartItems))
    },
    getItems(): CartItem[] {
      const storedItems = localStorage.getItem('checkoutItems')
      if (storedItems) {
        this.items = JSON.parse(storedItems) as CartItem[]
      }
      return this.items
    },
    clearItems() {
      this.items = []
      localStorage.removeItem('checkoutItems')
    }
  },
})
