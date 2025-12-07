<script setup lang="ts">
import type { Product } from '@/models/products'
import { Modal } from 'bootstrap'
import ViewProduct from './ViewProduct.vue'
import { ref } from 'vue'
import { formatAmount } from '@/helpers/utils'

const { product, isEditable } = defineProps<{ product: Product; isEditable: boolean }>()
const localProduct = ref<Product>(product)

function showProductDetails() {
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
  <div class="card cursor-pointer shadow-sm" style="width: 20rem" @click="showProductDetails">
    <img
      src="https://plus.unsplash.com/premium_photo-1700740342767-a40f6327c2ce?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ymx1ZSUyMGl0ZW18ZW58MHx8MHx8fDA%3D"
      class="card-img-top"
      alt="Product Image"
      style="height: 200px; object-fit: cover"
    />
    <div class="card-body">
      <h5 class="card-title">{{ localProduct.name }}</h5>
      <p class="card-text text-truncate text-muted">{{ localProduct.description || 'No description provided.' }}</p>
      <p class="card-text text-muted mb-0">Quantity: {{ localProduct.quantity }}</p>
      <p class="card-text mb-0 fs-5 text-primary">{{ formatAmount(localProduct.price) }}</p>
    </div>
  </div>
  <ViewProduct :product="localProduct" :isEditable="isEditable" @product="updateProduct" />
</template>

<style scoped>
.card:hover {
  background-color: var(--bs-light);
}
</style>
