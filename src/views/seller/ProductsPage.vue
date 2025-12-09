<script setup lang="ts">
import { getProducts } from '@/api/products'
import AddProduct from '@/components/AddProduct.vue'
import ListFooter from '@/components/ListFooter.vue'
import NoData from '@/components/NoData.vue'
import ProductCard from '@/components/ProductCard.vue'
import { debounce, isError } from '@/helpers/utils'
import type { Product } from '@/models/products'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { Modal } from 'bootstrap'
import { onMounted, ref, watch } from 'vue'

onMounted(() => {
  document.title = 'My Products'
  fetchProducts()
  debouncedFetch.value = debounce(() => fetchProducts(), 500)
})

const products = ref<Product[]>([])
const isLast = ref(false)
const isFetching = ref(false)
const controller = ref<AbortController | null>(null)
let page = -1
async function fetchProducts() {
  if (controller.value) controller.value.abort()
  controller.value = new AbortController()
  isFetching.value = true

  const response = await getProducts(
    'SELLER',
    {
      page: (page + 1).toString(),
      ...(searchValue.value ? { query: searchValue.value.trim() } : {}),
    },
    controller.value.signal,
  )

  if (isError(response)) {
    console.error('Error fetching products:', response.error)
    return
  }

  products.value.push(...(response.content as Product[]))
  isLast.value = response.last
  page = response.number
  isFetching.value = false
}

function showAddProduct() {
  const modal = document.getElementById('modal--add-product')
  if (modal) {
    const modalInstance = new Modal(modal)
    modalInstance.show()
  }
}

const productsContainer = ref<HTMLElement | null>(null)
async function onScroll() {
  if (!productsContainer.value) return

  const reachedBottom =
    productsContainer.value.scrollTop + productsContainer.value.clientHeight >=
    productsContainer.value.scrollHeight - 5

  if (reachedBottom && !isFetching.value) {
    if (isLast.value) return
    await fetchProducts()
  }

  if (!reachedBottom && controller.value) controller.value.abort()
}

function addProduct(product: Product) {
  products.value.push(product)
}

const searchValue = ref('')
const debouncedFetch = ref<(() => void) | null>(null)
watch(
  () => searchValue.value,
  () => {
    page = -1
    products.value = []
    isLast.value = false
    if (debouncedFetch.value) {
      debouncedFetch.value?.()
    }
  },
)
</script>

<template>
  <section id="my-products" class="section">
    <h1>My Products</h1>
    <p class="lead">Manage your products here.</p>

    <div class="my-products--actions flex-md-row mt-md-3">
      <button class="btn btn-primary" @click="showAddProduct">Add New Product</button>
      <AddProduct @product="addProduct" />

      <div class="input-group w-25 border border-dark rounded-3 bg-white" style="min-width: 20rem">
        <input
          type="text"
          class="form-control rounded-3 border-0"
          placeholder="Search products..."
          aria-label="Search products"
          aria-describedby="button-search"
          v-model="searchValue"
        />
        <button class="btn" type="button" id="button-search">
          <MagnifyingGlassIcon class="text-dark" style="height: 1.25rem; width: 1.25rem" />
        </button>
      </div>
    </div>

    <div
      ref="productsContainer"
      class="card p-5 w-100"
      style="max-height: 500px; overflow-y: auto"
      @scroll="onScroll"
    >
      <NoData v-if="products.length === 0" message="You have no products listed." />
      <div v-else class="d-flex gap-3 flex-wrap justify-content-center">
        <template v-for="product in products" :key="product.id">
          <ProductCard :product="product" :is-editable="true" />
        </template>
        <ListFooter :is-last="isLast" :list="products" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.input-group .form-control:focus {
  box-shadow: none;
}

.my-products--actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  margin-bottom: 1.5rem;
}
</style>
