import type { ApiError } from '@/models/global'
import type { OrderStatus } from '@/models/orders'

function isError(obj: object): obj is ApiError {
  return Array.isArray((obj as ApiError)?.error)
}

function debounce(fun: () => void, delay = 300): () => void {
  let timer: ReturnType<typeof setTimeout>

  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => fun(), delay)
  }
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
}

function formatDate(date?: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(date || '').toLocaleDateString('en-PH', options)
}

function isBeforeThisWeek(date?: string): boolean {
  const givenDate = new Date(date || '')
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  return givenDate < sevenDaysAgo
}

function humanizeStatus(status: OrderStatus): string {
  switch (status) {
    case 'TO_SHIP':
      return 'TO SHIP'
    default:
      return status
  }
}

export { debounce, isError, formatAmount, formatDate, isBeforeThisWeek, humanizeStatus }
