<script setup lang="ts">
import { cancelOrder, getOrder, updateStatus } from '@/api/orders'
import ProductCard from '@/components/ProductCard.vue'
import {
  formatAmount,
  formatDate,
  humanizeStatus,
  isBeforeThisWeek,
  isError,
} from '@/helpers/utils'
import { ORDER_STATUS, type Order, type OrderStatus } from '@/models/orders'
import { useAuthorizationStore } from '@/stores/authorization'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

onMounted(() => {
  document.title = 'Shopping App: Order Details'
  fetchOrder()
})

const auth = useAuthorizationStore()
const route = useRoute()
const order = ref<Order | null>(null)

async function fetchOrder() {
  const response = await getOrder(route.params.id as string)
  if (isError(response)) return

  order.value = response
}

async function cancelOrderDetails() {
  const response = await cancelOrder(order.value?.id || '')
  if (isError(response)) return
  order.value = response
}

const showMenu = ref(false)
async function setStatus(status: OrderStatus) {
  const response = await updateStatus(order.value?.id || '', status)
  if (isError(response)) return

  order.value = response
  showMenu.value = false
}
</script>

<template>
  <section id="order-details" class="section">
    <h1>Order Details</h1>
    <div v-if="order" class="w-100">
      <div class="d-flex flex-column align-items-center align-items-md-start gap-2">
        <p class="lead mb-0">{{ formatDate(order.orderDate) }}</p>
        <p
          class="badge"
          :class="{
            'text-bg-danger': order.status === 'CANCELED',
            'text-bg-success': order.status === 'DELIVERED',
            'text-bg-warning': order.status === 'SHIPPING',
            'text-bg-info': order.status === 'TO_SHIP',
            'text-bg-primary': order.status == 'PREPARING',
          }"
        >
          {{ humanizeStatus(order?.status) }}
        </p>

        <div class="d-flex flex-column-reverse flex-md-row gap-2 w-100">
          <button
            class="btn btn-outline-danger"
            :disabled="
              isBeforeThisWeek(order.orderDate) ||
              order.status === 'CANCELED' ||
              order.status === 'DELIVERED'
            "
            @click="cancelOrderDetails"
          >
            Cancel Order
          </button>

          <div
            v-if="
              order.sellerId === auth.id &&
              order.status !== 'DELIVERED' &&
              order.status !== 'CANCELED'
            "
            class="dropdown"
          >
            <button
              class="btn btn-outline-primary position-relative dropdown-toggle"
              @click="showMenu = !showMenu"
            >
              Update Status
            </button>
            <ul class="dropdown-menu" :class="{ show: showMenu }">
              <li
                v-for="status in ORDER_STATUS"
                :key="status"
                class="dropdown-item cursor-pointer"
                @click="setStatus(status)"
              >
                {{ humanizeStatus(status) }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="card p-3 mt-3 w-100">
        <div
          v-for="item in order.products"
          :key="item.product.id"
          class="row py-1 align-items-center"
        >
          <span class="col-4">{{ item.product.name }}</span>
          <span class="col-4 text-secondary text-end"
            >{{ formatAmount(item.priceAtPurchase) }} x {{ item.quantity }}</span
          >
          <span class="col-4 text-end">{{
            formatAmount(item.priceAtPurchase * item.quantity)
          }}</span>
        </div>
        <span class="text-end text-secondary">---------------</span>
        <span class="text-end text-success"> Total: {{ formatAmount(order.totalAmount) }} </span>
      </div>

      <div class="mt-3 w-100">
        <h4>Products:</h4>
        <div class="d-flex flex-wrap gap-3">
          <template v-for="item in order.products" :key="item.product.id">
            <ProductCard
              :product="item.product"
              :is-editable="false"
              :initial-quantity="item.quantity"
            />
          </template>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading order details...</p>
    </div>
  </section>
</template>
