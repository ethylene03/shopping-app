<script setup lang="ts">
import { deleteCartItem, getCartDetails } from '@/api/carts'
import CartItemCard from '@/components/CartItemCard.vue'
import NoData from '@/components/NoData.vue'
import { formatAmount, isError } from '@/helpers/utils'
import type { Cart, CartItem } from '@/models/carts'
import { useAuthorizationStore } from '@/stores/authorization'
import { useCheckoutStore } from '@/stores/checkout'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthorizationStore()

onMounted(() => {
  document.title = 'Shopping App: Cart'
  fetchCartDetails()
})

type LocalCart = Omit<Cart, 'products'> & { products: (CartItem & { isSelected: boolean })[] }
const cart = ref<LocalCart>({
  ...auth.cart,
  products: auth.cart.products.map((item) => ({ ...item, isSelected: false })),
})

async function fetchCartDetails() {
  const response = await getCartDetails()
  if (isError(response)) return

  cart.value = {
    ...response,
    products: response.products.map((item) => ({ ...item, isSelected: false })),
  }

  auth.cart = response
}

function updateItem(item: CartItem, selected: boolean) {
  const index = cart.value.products.findIndex((i) => i.id === item.id)
  if (index !== -1) {
    cart.value.products[index] = { ...item, isSelected: selected }
  }
}

const selectAll = ref(false)

const selectedItems = computed(() => cart.value.products.filter((item) => item.isSelected))
const selectedTotal = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
)

async function deleteCartItems() {
  await Promise.all(selectedItems.value.map((item) => deleteCartItem(item.id || '')))

  fetchCartDetails()
}

const router = useRouter()
function checkOutItems() {
  const checkoutStore = useCheckoutStore()
  checkoutStore.setItems(selectedItems.value)
  router.push({ name: 'Checkout' })
}
</script>

<template>
  <section id="my-products" class="section">
    <div class="content w-100 p-4">
      <h1>Shopping Bag</h1>
      <p class="lead">Check out your items now!</p>

      <div class="mt-4 w-100" :class="{ 'card p-3': cart.products.length === 0 }">
        <NoData
          v-if="cart.products.length === 0"
          message="There are no products in your cart yet."
        />
        <button
          v-if="cart.products.length === 0"
          class="btn btn-outline-primary"
          style="align-self: center"
          @click="$router.push({ name: 'Home' })"
        >
          Shop Now
        </button>

        <div v-else class="d-flex flex-column gap-3">
          <div class="row w-100 d-none d-md-flex ps-5 text-muted fw-light">
            <span class="col-3">Product Name</span>
            <span class="col-3 text-center">Price</span>
            <span class="col-3 text-center">Quantity</span>
            <span class="col-3 text-end">Total</span>
          </div>
          <template v-for="item in cart.products" :key="item.id">
            <CartItemCard
              :cart-item="item"
              :select-all="selectAll"
              @update="updateItem($event, item.isSelected)"
              @selected="item.isSelected = !item.isSelected"
            />
          </template>
        </div>
      </div>
    </div>

    <footer class="cart--footer p-md-5 flex-md-row align-items-md-center gap-md-0 z-3">
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
        <button class="btn text-danger" @click="deleteCartItems">Delete</button>
      </div>

      <div class="cart--footer-summary gap-md-5 justify-content-md-end">
        <h6 class="cart--footer-total flex-md-row align-items-md-center gap-md-3">
          Total ({{ selectedItems.length }} item{{ selectedItems.length > 1 ? 's' : '' }}):
          <span class="text-primary fs-2 fs-md-4">{{ formatAmount(selectedTotal) }}</span>
        </h6>

        <button
          type="button"
          class="btn btn-primary py-2 px-4"
          @click="checkOutItems"
          :disabled="selectedItems.length === 0"
        >
          Check Out
        </button>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.section {
  padding: 0;
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
