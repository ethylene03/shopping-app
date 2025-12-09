<script setup lang="ts">
import { createCartItem, updateCartItem } from '@/api/carts'
import { deleteProduct, updateProduct } from '@/api/products'
import { isError } from '@/helpers/utils'
import type { CartItem } from '@/models/carts'
import type { Product } from '@/models/products'
import { useAuthorizationStore } from '@/stores/authorization'
import { useCheckoutStore } from '@/stores/checkout'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { Modal } from 'bootstrap'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DeleteModal from './DeleteModal.vue'

const { product, editable } = defineProps<{ product: Product; editable: boolean }>()
const emit = defineEmits<{
  (e: 'product', product: Product): void
}>()

const error = ref('')
const isClicked = ref(false)
const isEditable = ref(editable)
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

  closeModal()
}

function closeModal() {
  const modalElement = document.getElementById('modal--product-' + product.id)
  if (modalElement) {
    const modalInstance = Modal.getInstance(modalElement)
    modalInstance?.hide()
  }
}

const itemQuantity = ref(0)
function changeQuantity(amount: number) {
  if (isEditable.value) localProduct.value.quantity += amount
  else itemQuantity.value += amount
}

let savedItem: CartItem | null = null
const auth = useAuthorizationStore()
async function addToCart() {
  error.value = ''
  const cartItem: CartItem = {
    cartId: auth.cart.id,
    product: localProduct.value,
    quantity: itemQuantity.value,
  }

  let response = await createCartItem(cartItem)

  if (isError(response) && response.error.join(', ') === 'CartItem exists, try updating instead.') {
    const cartItem = auth.cart.products.find((item) => item.product.id === localProduct.value.id)

    if (cartItem)
      response = await updateCartItem(cartItem.id || '', {
        ...cartItem,
        quantity: cartItem.quantity + itemQuantity.value,
      })
    if (isError(response)) {
      error.value = response.error.join(', ')
      return
    }

    auth.cart.products = auth.cart.products.map((item) =>
      item.id === (response as CartItem).id ? (response as CartItem) : item,
    )
  } else if (!isError(response)) auth.cart.products.push(response)
  else {
    error.value = response.error.join(', ')
    return
  }

  savedItem = response
  auth.cart.totalAmount += response.product.price * response.quantity
  closeModal()
}

const router = useRouter()
async function checkOutItem() {
  const checkoutStore = useCheckoutStore()

  await addToCart()
  if (savedItem) checkoutStore.setItems([{ ...savedItem, quantity: itemQuantity.value }])
  if (!savedItem) {
    const item = auth.cart.products.find((i) => i.product.id === localProduct.value.id)
    if (item) checkoutStore.setItems([{ ...item, quantity: itemQuantity.value }])
  }
  closeModal()

  router.push({ name: 'Checkout' })
}

function showDeleteModal() {
  const modal = document.getElementById('modal--delete-' + product.id)
  if (modal) {
    const modalInstance = new Modal(modal)
    closeModal()
    modalInstance.show()
  }
}

async function removeProduct() {
  await deleteProduct(product.id)

  const deleteModal = document.getElementById('modal--delete-' + product.id)
  if (deleteModal) {
    const modalInstance = Modal.getInstance(deleteModal)
    modalInstance?.hide()
  }

  const productModal = document.getElementById('modal--product-' + product.id)
  if (productModal) {
    const modalInstance = Modal.getInstance(productModal)
    modalInstance?.show()
  }

  localProduct.value.isDeleted = true
  isEditable.value = false
}
</script>

<template>
  <div class="modal fade" :id="'modal--product-' + product.id" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header border-bottom-0 p-4 pb-2">
          <h1 class="modal-title fs-5 me-2">Product Details</h1>
          <button v-if="isEditable" class="btn text-danger" @click="showDeleteModal">
            <TrashIcon style="height: 1.5rem; width: 1.5rem" />
          </button>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <form class="modal-body p-4" @submit.prevent="editProduct">
          <span
            v-if="localProduct.quantity <= 0"
            class="badge rounded-pill fs-6 px-3"
            style="background-color: var(--bs-yellow)"
          >
            Soldout
          </span>
          <span
            v-if="localProduct.isDeleted"
            class="badge rounded-pill fs-6 px-3"
            style="background-color: var(--bs-danger)"
          >
            Deleted
          </span>

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
              <label for="product--quantity" class="form-label">
                Quantity
                <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <button
                  type="button"
                  class="btn btn-outline-primary px-3"
                  @click="changeQuantity(-1)"
                  :disabled="localProduct.quantity < 1 && !isEditable || localProduct.isDeleted"
                >
                  -
                </button>

                <input
                  id="product--quantity"
                  type="number"
                  class="form-control flex-fill text-center"
                  :class="{ 'text-danger': localProduct.quantity < 0 }"
                  min="0"
                  v-model="localProduct.quantity"
                  required
                  style="max-width: 5rem"
                  :hidden="!isEditable"
                />

                <input
                  id="add-to-cart--quantity"
                  type="number"
                  class="form-control flex-fill text-center"
                  :class="{
                    'text-danger': itemQuantity < 0 || itemQuantity > localProduct.quantity,
                  }"
                  min="0"
                  :max="localProduct.quantity"
                  v-model="itemQuantity"
                  style="max-width: 5rem"
                  :hidden="isEditable"
                  :disabled="localProduct.quantity === 0 || localProduct.isDeleted"
                />

                <button
                  type="button"
                  class="btn btn-outline-primary px-3"
                  @click="changeQuantity(1)"
                  :disabled="localProduct.quantity <= 0 && !isEditable || localProduct.isDeleted"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger mt-3" role="alert">
            {{ error }}
          </div>

          <div class="mt-5 d-flex gap-3 justify-content-end" :class="{ 'd-none': isEditable }">
            <button
              type="button"
              class="btn text-primary border-0"
              @click="addToCart"
              :disabled="itemQuantity <= 0"
            >
              Add To Cart
            </button>
            <button
              type="button"
              class="btn btn-primary px-5"
              @click="checkOutItem"
              :disabled="itemQuantity <= 0"
            >
              Buy Now
            </button>
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
  <DeleteModal :id="product.id" @delete="removeProduct" />
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
