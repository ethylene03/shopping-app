import type { ApiError, Page } from '@/models/global'
import type { Order } from '@/models/orders'
import { DELETE, fetchApi, GET, POST, PUT } from './base'

async function createOrder(order: Order): Promise<Order | ApiError> {
  try {
    const response = await fetchApi(POST('/orders', order))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Order
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function getOrders(): Promise<Page | ApiError> {
  try {
    const response = await fetchApi(GET('/orders'))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Page
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function getOrder(id: string): Promise<Order | ApiError> {
  try {
    const response = await fetchApi(GET(`/orders/${id}`))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Order
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function getOrderItems(): Promise<Page | ApiError> {
  try {
    const response = await fetchApi(GET('/order-items'))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Page
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function updateStatus(order: Order): Promise<Order | ApiError> {
  try {
    const response = await fetchApi(PUT(`/orders/${order.id}`, { status: order.status }))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Order
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function cancelOrder(id: string): Promise<Order | ApiError> {
  try {
    const response = await fetchApi(DELETE(`/orders/${id}`))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Order
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

export { cancelOrder, createOrder, getOrder, getOrderItems, getOrders, updateStatus }
