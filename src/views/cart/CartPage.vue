<script setup lang="ts">
import { deleteCartItem } from '@/api/carts'
import CartItemCard from '@/components/CartItemCard.vue'
import NoData from '@/components/NoData.vue'
import { formatAmount } from '@/helpers/utils'
import type { Cart, CartItem } from '@/models/carts'
import { useAuthorizationStore } from '@/stores/authorization'
import { ref, watch } from 'vue'

const auth = useAuthorizationStore()

type LocalCart = Omit<Cart, 'products'> & { products: (CartItem & { isSelected: boolean })[] }
const cart = ref<LocalCart>({
  ...auth.cart,
  products: auth.cart.products.map((item) => ({ ...item, isSelected: false })),
})

const selectAll = ref(false)
watch(
  () => selectAll.value,
  () => {
    cart.value.products = cart.value.products.map((item) => ({
      ...item,
      isSelected: selectAll.value,
    }))
  },
)

async function deleteCartItems() {
  const toDeleteItems = cart.value.products.filter((item) => item.isSelected)
  await Promise.all(toDeleteItems.map((item) => deleteCartItem(item.id || '')))

  cart.value.products = cart.value.products.filter((item) => !item.isSelected)
}
</script>

<template>
  <section id="my-products" class="section">
    <h1>Shopping Bag</h1>
    <p class="lead">Check out your items now!</p>

    <div class="w-100" :class="{ 'card p-3': cart.products.length === 0 }">
      <NoData v-if="cart.products.length === 0" message="There are no products in your cart yet." />
      <button
        v-if="cart.products.length === 0"
        class="btn btn-outline-primary w-25"
        style="align-self: center"
        @click="$router.push({ name: 'Home' })"
      >
        Shop Now
      </button>

      <div class="d-flex flex-column gap-3">
        <div class="row w-100 d-none d-md-flex ps-5 text-muted fw-light">
          <span class="col-3">Product Name</span>
          <span class="col-3 text-center">Price</span>
          <span class="col-3 text-center">Quantity</span>
          <span class="col-3 text-end">Total</span>
        </div>
        <template v-for="item in cart.products" :key="item.id">
          <CartItemCard :cart-item="item" :select-all="selectAll" />
        </template>
      </div>
    </div>

    <footer class="cart--footer p-md-5 flex-md-row align-items-md-center gap-md-0">
      <div class="d-flex gap-2 gap-md-5 align-items-center">
        <div class="form-check mb-0">
          <input
            id="select-all"
            type="checkbox"
            class="form-check-input border-dark"
            v-model="selectAll"
          />
          <label for="select-all" class="form-check-label text-nowrap">Select All</label>
        </div>
        <button class="btn" @click="deleteCartItems">Delete</button>
      </div>

      <div class="cart--footer-summary gap-md-5 justify-content-md-end">
        <h6 class="cart--footer-total flex-md-rowalign-items-md-center gap-md-3">
          Total ({{ cart.products.length }} item{{ cart.products.length > 1 ? 's' : '' }}):
          <span class="text-primary fs-2 fs-md-4">{{ formatAmount(cart.totalAmount) }}</span>
        </h6>

        <button class="btn btn-primary py-2 px-4">Check Out</button>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.cart--footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  border-top: 1px solid var(--bs-secondary);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
}

.cart--footer-summary {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.cart--footer-total {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0rem;
  margin-bottom: 0;
}
</style>
