<script setup lang="ts">
import { updateCartItem } from '@/api/carts'
import { debounce, formatAmount, isError } from '@/helpers/utils'
import type { CartItem } from '@/models/carts'
import { onMounted, ref, watch } from 'vue'

const { cartItem, selectAll } = defineProps<{
  cartItem: CartItem & { isSelected: boolean }
  selectAll: boolean
}>()
const localItem = ref(cartItem)
const debouncedFetch = ref<(() => void) | null>(null)

onMounted(() => {
  debouncedFetch.value = debounce(handleSubmit, 500)
})

async function handleSubmit() {
  const response = await updateCartItem(localItem.value.id || '', localItem.value)
  if (isError(response)) return
}

watch(
  () => localItem.value.quantity,
  () => {
    if (debouncedFetch.value) {
      debouncedFetch.value?.()
    }
  },
)

watch(
  () => selectAll,
  () => {
    localItem.value.isSelected = selectAll
  },
)
</script>

<template>
  <div class="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
    <input type="checkbox" class="border-dark big-checkbox" v-model="localItem.isSelected" />

    <div class="w-100 row gap-2 gap-md-0">
      <h5 class="mb-0 col-12 col-md-3">{{ localItem.product.name }}</h5>

      <span class="text-start text-md-center col-md-3">
        {{ formatAmount(localItem.product.price) }}
      </span>

      <div class="col-md-3">
        <label for="name" class="form-label" hidden> Quantity </label>
        <div class="input-group justify-content-start justify-content-md-center">
          <button
            type="button"
            class="btn border-secondary-subtle px-3 py-0"
            @click="localItem.quantity -= 1"
          >
            -
          </button>
          <input
            type="number"
            class="form-control flex-fill text-center p-0"
            :class="{ 'text-danger': localItem.quantity < 1 }"
            id="name"
            min="1"
            v-model="localItem.quantity"
            required
            style="max-width: 4rem"
          />
          <button
            type="button"
            class="btn border-secondary-subtle px-3 py-0"
            @click="localItem.quantity += 1"
          >
            +
          </button>
        </div>
      </div>
      <div class="fs-5 text-primary text-end col-md-3">
        {{ formatAmount(localItem.product.price * localItem.quantity) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.big-checkbox {
  transform: scale(1.2);
  margin-right: 6px;
}
</style>
