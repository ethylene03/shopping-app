<script setup lang="ts">
import { getProducts } from '@/api/products'
import AddProduct from '@/components/AddProduct.vue'
import NoData from '@/components/NoData.vue'
import ProductCard from '@/components/ProductCard.vue'
import { isError } from '@/helpers/utils'
import type { Product } from '@/models/products'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { Modal } from 'bootstrap'
import { onMounted, ref } from 'vue'

onMounted(() => {
  document.title = 'My Products'
  fetchProducts()
})

const products = ref<Product[]>([])
async function fetchProducts() {
  const response = await getProducts('SELLER')

  if (isError(response)) {
    console.error('Error fetching products:', response.error)
    return
  }

  products.value = response.content as Product[]
}

function showAddProduct() {
  const modal = document.getElementById('modal--add-product')
  if (modal) {
    const modalInstance = new Modal(modal)
    modalInstance.show()
  }
}

function addProduct(product: Product) {
  products.value.push(product)
}
</script>

<template>
  <section id="my-products" class="section">
    <h1>My Products</h1>
    <p class="lead">Manage your products here.</p>

    <div class="d-flex flex-column flex-md-row gap-3 justify-content-between w-100 my-4 mt-0 mt-md-3">
      <button class="btn btn-primary" @click="showAddProduct">Add New Product</button>
      <AddProduct @product="addProduct" />

      <div class="input-group w-25 border border-dark rounded-3 bg-white" style="min-width: 20rem">
        <input
          type="text"
          class="form-control rounded-3 border-0"
          placeholder="Search products..."
          aria-label="Search products"
          aria-describedby="button-search"
        />
        <button class="btn" type="button" id="button-search">
          <MagnifyingGlassIcon class="text-dark" style="height: 1.25rem; width: 1.25rem" />
        </button>
      </div>
    </div>

    <div class="card p-5 w-100" style="max-height: 500px; overflow-y: auto;">
      <NoData v-if="products.length === 0" message="You have no products listed." />
      <div v-else class="d-flex gap-3 flex-wrap">
        <template v-for="product in products" :key="product.id">
          <ProductCard :product="product" :is-editable="true" />
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.input-group .form-control:focus {
  box-shadow: none;
}
</style>
