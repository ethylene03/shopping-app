<script setup lang="ts">
import type { Product } from '@/models/products'
import { Modal } from 'bootstrap'
import ViewProduct from './ViewProduct.vue'
import { ref } from 'vue'
import { formatAmount } from '@/helpers/utils'

const { product, isEditable } = defineProps<{ product: Product; isEditable: boolean }>()
const localProduct = ref<Product>(product)

function showProductDetails() {
  if(localProduct.value.isDeleted) return
  const modal = document.getElementById('modal--product-' + product.id)
  if (modal) {
    const modalInstance = new Modal(modal)
    modalInstance.show()
  }
}

function updateProduct(newProduct: Product) {
  localProduct.value = newProduct
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
      <p v-if="localProduct.quantity > 0" class="card-text text-muted mb-0">
        Quantity: {{ localProduct.quantity }}
      </p>
      <p class="card-text mb-0 fs-5 text-primary">{{ formatAmount(localProduct.price) }}</p>
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

.deleted-badge, .sold-out-badge {
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
