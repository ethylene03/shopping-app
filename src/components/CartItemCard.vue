<script setup lang="ts">
import { deleteCartItem, updateCartItem } from '@/api/carts'
import { debounce, formatAmount, isError } from '@/helpers/utils'
import type { CartItem } from '@/models/carts'
import { onMounted, ref, watch } from 'vue'

const { cartItem, selectAll } = defineProps<{
  cartItem: CartItem & { isSelected: boolean }
  selectAll: boolean
}>()
const localItem = ref(cartItem)
const debouncedFetch = ref<(() => void) | null>(null)
const selectInput = ref(cartItem.isSelected)

onMounted(() => {
  debouncedFetch.value = debounce(handleSubmit, 500)
})

const emit = defineEmits<{
  (e: 'update', item: CartItem): void
  (e: 'selected'): void
}>()

async function handleSubmit() {
  if (localItem.value.quantity < 1) {
    await deleteCartItem(localItem.value.id || '')
    emit('update', localItem.value)
    return
  }

  const response = await updateCartItem(localItem.value.id || '', localItem.value)
  if (isError(response)) return
  emit('update', response)
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
    selectInput.value = selectAll
  },
)

watch(
  () => selectInput.value,
  () => {
    emit('selected')
  },
)
</script>

<template>
  <div class="card p-3 d-flex flex-row align-items-center gap-3 shadow-sm">
    <input type="checkbox" class="border-dark big-checkbox" v-model="selectInput" />

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
            :disabled="localItem.quantity <= 1"
          >
            -
          </button>
          <input
            type="number"
            class="form-control flex-fill text-center p-0"
            :class="{
              'text-danger':
                localItem.quantity < 1 || localItem.quantity > localItem.product.quantity,
            }"
            id="name"
            min="1"
            :max="localItem.product.quantity"
            v-model="localItem.quantity"
            required
            style="max-width: 4rem"
            :disabled="localItem.quantity >= localItem.product.quantity || localItem.quantity <= 1"
          />
          <button
            type="button"
            class="btn border-secondary-subtle px-3 py-0"
            @click="localItem.quantity += 1"
            :disabled="localItem.quantity >= localItem.product.quantity"
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
