<script setup lang="ts">
import { updateProduct } from '@/api/products'
import { isError } from '@/helpers/utils'
import type { Product } from '@/models/products'
import { Modal } from 'bootstrap'
import { ref } from 'vue'

const { product, isEditable } = defineProps<{ product: Product; isEditable: boolean }>()
const emit = defineEmits<{
  (e: 'product', product: Product): void
}>()

const error = ref('')
const isClicked = ref(false)
const localProduct = ref<Product>(
  product ||
    ({
      name: '',
      description: '',
      price: 0.0,
      quantity: 1,
    } as Product),
)

async function editProduct() {
  isClicked.value = true
  error.value = ''

  const response = await updateProduct(localProduct.value)
  if (isError(response)) {
    error.value = response.error.join(', ')
    isClicked.value = false
    return
  }

  emit('product', response)
  isClicked.value = false

  const modalElement = document.getElementById('modal--product-' + product.id)
  if (modalElement) {
    const modalInstance = Modal.getInstance(modalElement)
    modalInstance?.hide()
  }
}
</script>

<template>
  <div class="modal fade" :id="'modal--product-' + product.id" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header border-bottom-0 p-4 pb-2">
          <h1 class="modal-title fs-5">Product Details</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <form class="modal-body p-4" :class="{ 'mb-5': !isEditable }" @submit.prevent="editProduct">
          <div class="my-3">
            <label for="name" class="form-label">
              Product Name
              <span class="text-danger" :hidden="!isEditable">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="localProduct.name"
              required
              :readonly="!isEditable"
            />
          </div>

          <div class="my-3">
            <label for="name" class="form-label">Description</label>
            <textarea
              class="form-control"
              id="name"
              rows="5"
              style="resize: none"
              v-model="localProduct.description"
              :readonly="!isEditable"
            />
          </div>

          <div class="d-flex flex-column flex-md-row gap-4">
            <div class="text-start flex-fill">
              <label for="name" class="form-label">
                Price
                <span class="text-danger" :hidden="!isEditable">*</span>
              </label>
              <div class="input-group">
                <span class="input-group-text">PHP</span>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  :class="{ 'text-danger': localProduct.price < 0, 'text-primary': !isEditable }"
                  id="name"
                  v-model="localProduct.price"
                  required
                  :readonly="!isEditable"
                />
              </div>
            </div>

            <div class="text-start flex-fill">
              <label for="name" class="form-label">
                Quantity
                <span class="text-danger" :hidden="!isEditable">*</span>
              </label>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-outline-primary px-3"
                  @click="localProduct.quantity -= 1"
                  :hidden="!isEditable"
                >
                  -
                </button>
                <input
                  type="number"
                  class="form-control flex-fill text-center"
                  :class="{ 'text-danger': localProduct.quantity < 0 }"
                  id="name"
                  min="1"
                  v-model="localProduct.quantity"
                  required
                  style="max-width: 5rem"
                  :readonly="!isEditable"
                />
                <button
                  type="button"
                  class="btn btn-outline-primary px-3"
                  @click="localProduct.quantity += 1"
                  :hidden="!isEditable"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger mt-3" role="alert">
            {{ error }}
          </div>

          <div class="mt-5" :class="{ 'd-flex gap-4': isEditable }" :hidden="!isEditable">
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

<style scoped>
input:focus {
  box-shadow: none;
}
select:focus {
  box-shadow: none;
}
textarea:focus {
  box-shadow: none;
}
</style>
