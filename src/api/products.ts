import type { ApiError, Page } from '@/models/global'
import type { Product } from '@/models/products'
import { DELETE, fetchApi, GET, POST, PUT } from './base'

async function createProduct(product: Product): Promise<Product | ApiError> {
  try {
    const response = await fetchApi(POST('/products', product))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Product
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function getProducts(
  role: 'BUYER' | 'SELLER',
  query?: Record<string, string>,
  signal?: AbortSignal,
): Promise<Page | ApiError> {
  try {
    const response = await fetchApi(GET('/products', { ...query, role }, signal))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Page
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function getProduct(id: string): Promise<Product | ApiError> {
  try {
    const response = await fetchApi(GET(`/products/${id}`))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Product
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function updateProduct(product: Product): Promise<Product | ApiError> {
  try {
    const response = await fetchApi(PUT(`/products/${product.id}`, product))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Product
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function addQuantity(productId: string, amount: number): Promise<Product | ApiError> {
  try {
    const response = await fetchApi(
      PUT(`/products/${productId}/quantity`, { quantity: amount } as Product),
    )
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError

    return data as Product
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

async function deleteProduct(id: string): Promise<void | ApiError> {
  try {
    const response = await fetchApi(DELETE(`/products/${id}`))
    const data = await response.json()

    if (!response.ok) return { error: data.error } as ApiError
  } catch (error) {
    if (error instanceof TypeError) return { error: ['Network/Fetch error'] } as ApiError

    return { error: ['Unknown error'] } as ApiError
  }
}

export { addQuantity, createProduct, deleteProduct, getProduct, getProducts, updateProduct }
