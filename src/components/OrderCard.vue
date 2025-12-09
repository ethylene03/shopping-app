<script setup lang="ts">
import { formatAmount, formatDate, humanizeStatus } from '@/helpers/utils'
import type { Order } from '@/models/orders'
import { ref } from 'vue'

const { order } = defineProps<{ order: Order }>()
const isCopied = ref(false)

function copyId() {
  navigator.clipboard.writeText(order.id || '')
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}
</script>

<template>
  <div
    class="order-card--container card shadow-sm mb-4 cursor-pointer"
    @click="$router.push({ name: 'OrderDetails', params: { id: order.id } })"
  >
    <div class="px-3 py-2 d-flex justify-content-between align-items-center">
      <span>{{ formatDate(order.orderDate) }}</span>
      <span
        class="small"
        :class="{ 'text-success': isCopied, 'text-primary': !isCopied }"
        @click.stop="copyId"
      >
        {{ isCopied ? 'Order ID Copied!' : 'Copy Order ID' }}
      </span>
    </div>

    <div class="card bg-transparent p-3 m-2">
      <div class="d-flex justify-content-between align-items-center">
        <span class="fs-5">{{ order.products[0]?.product.name }}</span>
        <span class="fs-5 fw-light">
          {{
            formatAmount(
              (order.products[0]?.priceAtPurchase || 0) * (order.products[0]?.quantity || 0),
            )
          }}
        </span>
      </div>

      <div class="text-start fw-light">
        {{ formatAmount(order.products[0]?.priceAtPurchase || 0) }}
        <small class="text-muted">x {{ order.products[0]?.quantity }}</small>
      </div>
    </div>

    <button
      v-if="order.products.length > 1"
      class="btn border-0 text-primary w-auto px-3"
      @click.stop="$router.push({ name: 'OrderDetails', params: { id: order.id } })"
    >
      Show More
    </button>

    <div class="d-flex justify-content-between align-items-center p-3">
      <span
        :class="{
          'text-bg-danger': order.status === 'CANCELED',
          'text-bg-success': order.status === 'DELIVERED',
          'text-bg-warning': order.status === 'SHIPPING',
          'text-bg-info': order.status === 'TO_SHIP',
          'text-bg-primary': order.status == 'PREPARING',
        }"
        class="badge"
      >
        {{ humanizeStatus(order.status) }}
      </span>

      <span class="text-success fw-bold">
        <span class="d-none d-md-inline">Grand Total: </span>
        {{ formatAmount(order.totalAmount) }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.order-card--container:hover {
  background-color: var(--bs-primary-bg-subtle);
}
</style>
