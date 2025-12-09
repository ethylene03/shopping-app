<script setup lang="ts">
import { getProducts } from '@/api/products'
import ListFooter from '@/components/ListFooter.vue'
import NoData from '@/components/NoData.vue'
import ProductCard from '@/components/ProductCard.vue'
import { debounce, isError } from '@/helpers/utils'
import type { Product } from '@/models/products'
import { useAuthorizationStore } from '@/stores/authorization'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref, watch } from 'vue'

onMounted(() => {
  document.title = 'Home'
  fetchProducts()
  debouncedFetch.value = debounce(() => fetchProducts(), 500)
})

const auth = useAuthorizationStore()

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
    'BUYER',
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

const pageSection = ref<HTMLElement | null>(null)
async function onScroll() {
  if (!pageSection.value) return

  const reachedBottom =
    pageSection.value.scrollTop + pageSection.value.clientHeight >=
    pageSection.value.scrollHeight - 5

  if (reachedBottom && !isFetching.value) {
    if (isLast.value) return
    await fetchProducts()
  }

  if (!reachedBottom && controller.value) controller.value.abort()
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
  <section ref="pageSection" id="my-products" class="section" @scroll="onScroll">
    <h1>Welcome, {{ auth.name }}</h1>
    <p class="lead">Browse products here.</p>
    <div class="input-group col-12 col-md-3 border border-dark rounded-3 bg-white my-4">
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

    <div class="w-100" :class="{ 'card p-3': products.length === 0 }">
      <NoData v-if="products.length === 0" message="There are no products for sale yet." />
      <div v-else class="home--products-container flex-md-row flex-md-wrap align-items-md-stretch">
        <template v-for="product in products" :key="product.id">
          <ProductCard :product="product" :is-editable="false" />
        </template>
        <ListFooter :is-last="isLast" :list="products" />
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
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

@media screen and (min-width: 768px) {
  .input-group {
    align-self: flex-end;
  }
}
</style>
