<script setup lang="ts">
import { deleteCartItem } from '@/api/carts'
import { createOrder } from '@/api/orders'
import ResponseToast from '@/components/ResponseToast.vue'
import { formatAmount, isError } from '@/helpers/utils'
import type { Order, OrderItem } from '@/models/orders'
import { useAuthorizationStore } from '@/stores/authorization'
import { useCheckoutStore } from '@/stores/checkout'
import { Toast } from 'bootstrap'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
  document.title = 'Checkout'
})

const checkoutStore = useCheckoutStore()
const auth = useAuthorizationStore()
const items = checkoutStore.getItems()
const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

const router = useRouter()

async function placeOrder() {
  const order: Order = {
    buyerId: auth.id,
    status: 'PREPARING',
    totalAmount: total,
    products: items.map((item) => {
      return {
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      } as OrderItem
    }),
  }

  const response = await createOrder(order)
  if (isError(response)) {
    console.error(response.error)
    return
  }

  await Promise.all(
    items.map(async (item) => {
      await deleteCartItem(item.id || '')
      auth.removeCartItem(item.id || '')
    }),
  )

  const successToast = document.getElementById('toast--component-success')
  const toast = successToast ? new Toast(successToast) : null
  toast?.show()

  setTimeout(() => {
    checkoutStore.clearItems()
    router.push({ name: 'Orders' })
  }, 500)
}

onUnmounted(() => {
  checkoutStore.clearItems()
})
</script>

<template>
  <section id="checkout" class="section">
    <div class="content w-100 p-4">
      <h1>Checkout</h1>
      <p class="lead">Review the items before placing your order.</p>

      <div class="card p-3 w-100 mt-5">
        <template v-for="item in items" :key="item.id">
          <div class="mb-3 p-3 border rounded-3 w-100">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">{{ item.product.name }}</h5>
              <span class="fs-5 fw-light">
                {{ formatAmount(item.product.price) }}
                <small class="text-muted">x {{ item.quantity }}</small>
              </span>
            </div>
            <div class="text-end fw-bold text-primary">
              Total: {{ formatAmount(item.product.price * item.quantity) }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <footer class="cart--footer p-md-5 flex-md-row align-items-md-center gap-md-5">
      <h6 class="cart--footer-total flex-md-row align-items-md-center gap-md-3">
        Total ({{ items.length }} item{{ items.length > 1 ? 's' : '' }}):
        <span class="text-primary fs-2 fs-md-4">{{ formatAmount(total) }}</span>
      </h6>

      <button type="button" class="btn btn-primary py-2 px-4" @click="placeOrder">
        Place Order
      </button>
    </footer>
    <ResponseToast id="success" type="success" message="Your order has been placed successfully!" />
  </section>
</template>

<style scoped>
.section {
  padding: 0;
  flex: 1;
  overflow: hidden;
}

.content {
  overflow: scroll;
  flex: 1;
}

.cart--footer {
  width: 100%;
  background-color: white;
  border-top: 1px solid var(--bs-secondary);

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.cart--footer-total {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0rem;
  margin-bottom: 0;
}
</style>
