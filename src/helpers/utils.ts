import type { ApiError } from '@/models/global'

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

export { debounce, isError, formatAmount }
