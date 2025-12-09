<script setup lang="ts">
import { getOrders } from '@/api/orders'
import ListFooter from '@/components/ListFooter.vue'
import NoData from '@/components/NoData.vue'
import OrderCard from '@/components/OrderCard.vue'
import { isError } from '@/helpers/utils'
import type { Order } from '@/models/orders'
import { onMounted, ref } from 'vue'

onMounted(() => {
  document.title = 'Order History'
  fetchOrders()
})

const orders = ref<Order[]>([] as Order[])
const isLast = ref(false)
const controller = ref<AbortController | null>(null)
const isFetching = ref(false)
let page = 0

async function fetchOrders(nextPage?: number) {
  if (controller.value) controller.value.abort()
  controller.value = new AbortController()
  isFetching.value = true

  const response = await getOrders(
    { role: 'BUYER', page: nextPage?.toString() || '0' },
    controller.value.signal,
  )
  if (isError(response)) return

  orders.value.push(...(response.content as Order[]))
  isLast.value = response.last
  page = response.number
  isFetching.value = false
}

const orderContainer = ref<HTMLElement | null>(null)
async function onScroll() {
  if (!orderContainer.value) return

  const reachedBottom =
    orderContainer.value.scrollTop + orderContainer.value.clientHeight >=
    orderContainer.value.scrollHeight - 5

  if (reachedBottom && !isFetching.value) {
    if (isLast.value) return
    await fetchOrders(page + 1)
  }

  if (!reachedBottom && controller.value) controller.value.abort()
}
</script>

<template>
  <section ref="orderContainer" id="orders" class="section" @scroll="onScroll">
    <h1>Order History</h1>
    <p class="lead text-center text-md-start">View, cancel, or check your recent orders here.</p>

    <div class="mt-5 w-100">
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />
    </div>
    <NoData
      v-if="orders.length === 0"
      message="You have no orders yet."
      class="card w-100 p-3 d-flex flex-column align-items-center"
    />
    <ListFooter :is-last="isLast" :list="orders" />
  </section>
</template>
