<script setup lang="ts">
import type { Product } from '@/models/products'
import { Modal } from 'bootstrap'
import ViewProduct from './ViewProduct.vue'
import { ref } from 'vue';

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
  <div class="card cursor-pointer shadow-sm" style="max-width: 15rem" @click="showProductDetails">
    <img
      src="https://wallpapercave.com/wp/wp7740670.jpg"
      class="card-img-top"
      alt="Product Image"
    />
    <div class="card-body">
      <h5 class="card-title">{{ localProduct.name }}</h5>
      <p class="card-text text-truncate text-muted">{{ localProduct.description }}</p>
      <p class="card-text text-muted mb-0">Quantity: {{ localProduct.quantity }}</p>
      <p class="card-text mb-0 fs-5 text-primary">PHP {{ localProduct.price.toFixed(2) }}</p>
    </div>
  </div>
  <ViewProduct :product="localProduct" :isEditable="isEditable" @product="updateProduct" />
</template>

<style scoped>
.card:hover {
  background-color: var(--bs-light);
}
</style>
