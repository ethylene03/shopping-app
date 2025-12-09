import type { ApiError, Page } from '@/models/global'
import type { Order, OrderStatus } from '@/models/orders'
import { fetchApi, GET, POST, PUT } from './base'

async function createOrder(order: Order): Promise<Order[] | ApiError> {
  try {
    const response = await fetchApi(POST('/orders', order))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Order[]
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function getOrders(
  query: Record<string, string>,
  signal: AbortSignal,
): Promise<Page | ApiError> {
  try {
    const response = await fetchApi(GET('/orders', query, signal))
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

async function updateStatus(orderId: string, status: OrderStatus): Promise<Order | ApiError> {
  try {
    const response = await fetchApi(PUT(`/orders/${orderId}/status`, { status }))
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
    const response = await fetchApi(PUT(`/orders/${id}/cancel`, null))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Order
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

export { cancelOrder, createOrder, getOrder, getOrders, updateStatus }
