<script setup lang="ts">
import { getProducts } from '@/api/products'
import NoData from '@/components/NoData.vue'
import ProductCard from '@/components/ProductCard.vue'
import { isError } from '@/helpers/utils'
import type { Product } from '@/models/products'
import { useAuthorizationStore } from '@/stores/authorization'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref } from 'vue'

onMounted(() => {
  document.title = 'Home'
  fetchProducts()
})

const auth = useAuthorizationStore()

const products = ref<Product[]>([])
async function fetchProducts() {
  const response = await getProducts('BUYER')

  if (isError(response)) {
    console.error('Error fetching products:', response.error)
    return
  }

  products.value = response.content as Product[]
}
</script>

<template>
  <section id="my-products" class="section">
    <h1>Welcome, {{ auth.name }}</h1>
    <p class="lead">Browse products here.</p>
    <div class="input-group col-12 col-md-3 border border-dark rounded-3 bg-white my-4">
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

    <div class="w-100" :class="{ 'card p-3': products.length === 0 }">
      <NoData v-if="products.length === 0" message="You have no products listed." />
      <div v-else class="home--products-container flex-md-row">
        <template v-for="product in products" :key="product.id">
          <ProductCard :product="product" :is-editable="false" />
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.input-group {
  width: auto;
  min-width: 20rem;
  align-self: center;
}

.home--products-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.5rem;
}

@media screen and (min-width: 768px) {
  .input-group {
    align-self: flex-end;
  }
}
</style>
