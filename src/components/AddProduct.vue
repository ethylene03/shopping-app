<script setup lang="ts">
import { createProduct } from '@/api/products'
import { isError } from '@/helpers/utils'
import type { Product } from '@/models/products'
import { Modal } from 'bootstrap'
import { ref } from 'vue'

const isClicked = ref(false)
const product = ref<Product>({
  name: '',
  description: '',
  price: 0.0,
  quantity: 1,
} as Product)
const error = ref('')
const emit = defineEmits<{
  (e: 'product', product: Product): void
}>()

async function addProduct() {
  isClicked.value = true
  error.value = ''

  const response = await createProduct(product.value)
  if (isError(response)) {
    error.value = response.error.join(', ')
    isClicked.value = false
    return
  }

  emit('product', response)
  isClicked.value = false

  const modalElement = document.getElementById('modal--add-product')
  if (modalElement) {
    const modalInstance = Modal.getInstance(modalElement)
    modalInstance?.hide()
  }
}
</script>

<template>
  <div class="modal fade" id="modal--add-product" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header border-bottom-0 p-4 pb-2">
          <h1 class="modal-title fs-5">New Product</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <form class="modal-body p-4" @submit.prevent="addProduct">
          <div class="my-3">
            <label for="name" class="form-label">
              Product Name
              <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" id="name" v-model="product.name" required />
          </div>

          <div class="my-3">
            <label for="name" class="form-label">Description</label>
            <textarea
              class="form-control"
              id="name"
              rows="5"
              style="resize: none"
              v-model="product.description"
            />
          </div>

          <div class="d-flex flex-column flex-md-row gap-4">
            <div class="text-start flex-fill">
              <label for="name" class="form-label">
                Price
                <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <span class="input-group-text">PHP</span>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  id="name"
                  v-model="product.price"
                  required
                />
              </div>
            </div>

            <div class="text-start flex-fill">
              <label for="name" class="form-label">
                Quantity
                <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-outline-primary px-3"
                  @click="product.quantity -= 1"
                >
                  -
                </button>
                <input
                  type="number"
                  class="form-control flex-fill text-center"
                  :class="{ 'text-danger': product.quantity < 0 }"
                  id="name"
                  min="1"
                  v-model="product.quantity"
                  required
                  style="max-width: 5rem"
                />
                <button
                  type="button"
                  class="btn btn-outline-primary px-3"
                  @click="product.quantity += 1"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger mt-3" role="alert">
            {{ error }}
          </div>

          <div class="mt-5 d-flex gap-4">
            <button
              type="button"
              class="btn btn-outline-primary px-5 flex-fill"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary px-5 flex-fill" :disabled="isClicked">
              <div
                v-if="isClicked"
                class="spinner-border spinner-border-sm text-white d-block mx-auto my-1"
                role="status"
              ></div>
              <span v-else>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
