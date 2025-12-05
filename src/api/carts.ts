import type { CartItem } from '@/models/carts'
import { DELETE, fetchApi, POST, PUT } from './base'
import type { ApiError } from '@/models/global'

async function createCartItem(cartItem: CartItem): Promise<CartItem | ApiError> {
  try {
    const response = await fetchApi(POST('/cart-items', cartItem))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as CartItem
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function updateCartItem(id: string, cartItem: CartItem): Promise<CartItem | ApiError> {
  try {
    const response = await fetchApi(PUT(`/cart-items/${id}`, cartItem))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as CartItem
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function deleteCartItem(id: string): Promise<void | ApiError> {
  try {
    const response = await fetchApi(DELETE(`/cart-items/${id}`))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

export { createCartItem, deleteCartItem, updateCartItem }
