<script setup lang="ts">
import type { Product } from '@/models/products'
import { Modal } from 'bootstrap'
import ViewProduct from './ViewProduct.vue'
import { ref } from 'vue'
import { formatAmount, isError } from '@/helpers/utils'
import { CheckIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/vue/24/solid'
import { useAuthorizationStore } from '@/stores/authorization'
import type { CartItem } from '@/models/carts'
import { createCartItem, updateCartItem } from '@/api/carts'
import { useRouter } from 'vue-router'
import { useCheckoutStore } from '@/stores/checkout'

const { product, isEditable } = defineProps<{ product: Product; isEditable: boolean }>()
const localProduct = ref<Product>(product)

function showProductDetails() {
  if (localProduct.value.isDeleted) return
  const modal = document.getElementById('modal--product-' + product.id)
  if (modal) {
    const modalInstance = new Modal(modal)
    modalInstance.show()
  }
}

function updateProduct(newProduct: Product) {
  localProduct.value = newProduct
}

const auth = useAuthorizationStore()
const isAddedToCart = ref(false)
async function addToCart() {
  const cartItem: CartItem = {
    cartId: auth.cart.id,
    product: localProduct.value,
    quantity: 1,
  }

  let response = await createCartItem(cartItem)

  if (isError(response) && response.error.join(', ') === 'CartItem exists, try updating instead.') {
    const cartItem = auth.cart.products.find((item) => item.product.id === localProduct.value.id)

    if (cartItem)
      response = await updateCartItem(cartItem.id || '', {
        ...cartItem,
        quantity: cartItem.quantity + 1,
      })
    if (isError(response)) return

    auth.cart.products = auth.cart.products.map((item) =>
      item.id === (response as CartItem).id ? (response as CartItem) : item,
    )
  } else if (!isError(response)) auth.cart.products.push(response)
  else return

  savedItem = response
  auth.cart.totalAmount += response.product.price * response.quantity
  isAddedToCart.value = true
  setTimeout(() => {
    isAddedToCart.value = false
  }, 2000)
}

const router = useRouter()
let savedItem: CartItem | null = null
async function checkOutItem() {
  const checkoutStore = useCheckoutStore()

  await addToCart()
  if (savedItem) checkoutStore.setItems([{ ...savedItem, quantity: 1 }])
  if (!savedItem) {
    const item = auth.cart.products.find((i) => i.product.id === localProduct.value.id)
    if (item) checkoutStore.setItems([{ ...item, quantity: 1 }])
  }

  router.push({ name: 'Checkout' })
}
</script>

<template>
  <div
    class="product-card card shadow-sm"
    :class="{ 'cursor-pointer': !localProduct.isDeleted }"
    style="width: 18rem"
    @click="showProductDetails"
  >
    <img
      src="https://plus.unsplash.com/premium_photo-1700740342767-a40f6327c2ce?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ymx1ZSUyMGl0ZW18ZW58MHx8MHx8fDA%3D"
      class="card-img-top position-relative"
      alt="Product Image"
      style="height: 200px; object-fit: cover"
    />
    <div class="card-body">
      <h5 class="card-title">{{ localProduct.name }}</h5>

      <p class="card-text text-truncate text-muted">
        {{ localProduct.description || 'No description provided.' }}
      </p>
      <p class="card-text text-muted mb-0">Quantity: {{ localProduct.quantity }}</p>
      <p class="card-text mb-0 fs-5 text-primary">{{ formatAmount(localProduct.price) }}</p>

      <div v-if="!isEditable" class="d-flex justify-content-between gap-3 mt-4">
        <button
          class="btn border-0"
          :class="{ 'text-primary': !isAddedToCart, 'text-success': isAddedToCart }"
          @click.stop="addToCart"
          :hidden="localProduct.quantity < 1 || localProduct.isDeleted"
        >
          <ShoppingCartIcon style="height: 1.5rem; width: 1.5rem" />
          <PlusIcon v-if="!isAddedToCart" style="height: 1rem; width: 1rem" />
          <CheckIcon v-else style="height: 1rem; width: 1rem" />
        </button>
        <button
          class="btn btn-primary flex-fill"
          @click.stop="checkOutItem"
          :hidden="localProduct.quantity < 1 || localProduct.isDeleted"
        >
          Buy Now
        </button>
      </div>
    </div>

    <span v-if="localProduct.quantity < 1" class="sold-out-badge"> Soldout </span>
    <span v-if="localProduct.isDeleted" class="deleted-badge"> Deleted </span>
  </div>
  <ViewProduct :product="localProduct" :editable="isEditable" @product="updateProduct" />
</template>

<style scoped>
.product-card:has(.deleted-badge) .card-img-top,
.product-card:has(.sold-out-badge) .card-img-top {
  opacity: 0.6;
}

.card:hover {
  background-color: var(--bs-light);
}

.deleted-badge,
.sold-out-badge {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  z-index: 10;
}

.deleted-badge {
  background-color: var(--bs-danger);
  color: white;
}

.sold-out-badge {
  background-color: var(--bs-yellow);
  color: white;
}
</style>
