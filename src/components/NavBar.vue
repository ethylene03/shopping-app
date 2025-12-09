<script setup lang="ts">
import { logout } from '@/api/authorization'
import { useAuthorizationStore } from '@/stores/authorization'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowRightStartOnRectangleIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
} from '@heroicons/vue/24/solid'

const route = useRoute()
const router = useRouter()
const auth = useAuthorizationStore()

async function logoutUser() {
  await logout()

  auth.$reset()

  router.push({ name: 'Login' })
}

const currentPath = computed(() => {
  return route.name?.toString().toLowerCase() || ''
})

const isOpen = ref<boolean>(false)
const showDropdown = ref<boolean>(false)

watch(
  () => route.path,
  () => {
    isOpen.value = false
    showDropdown.value = false
  },
)
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-white shadow-sm position-sticky top-0 z-3">
    <div class="container-fluid py-3 px-5">
      <h1 class="navbar-brand mb-0">Shopping App</h1>
      <button
        class="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        @click="isOpen = !isOpen"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        id="navbarNav"
        :class="[{ collapse: !isOpen }, 'navbar-collapse', { show: isOpen }]"
        class="ms-3 justify-content-between"
      >
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/home">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/orders">Order History</router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li v-if="auth.role === 'SELLER'" class="nav-item dropdown me-3">
            <a
              class="nav-link dropdown-toggle"
              role="button"
              aria-expanded="false"
              @click="showDropdown = !showDropdown"
            >
              <BuildingStorefrontIcon style="height: 1.5rem; width: 1.5rem" />
            </a>
            <ul
              class="dropdown-menu"
              :class="{ show: showDropdown, active: currentPath.startsWith('seller') }"
            >
              <li>
                <router-link class="dropdown-item" to="/seller/products">My Products</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/seller/orders">Orders</router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item me-5">
            <router-link class="nav-link position-relative p-0 m-2" to="/cart">
              <shopping-bag-icon style="height: 1.5rem; width: 1.5rem" />
              <span
                v-if="auth.cart.products?.length > 0"
                class="position-absolute top-0 translate-middle badge rounded-pill bg-danger"
              >
                {{ auth.cart.products?.length }}
              </span>
            </router-link>
          </li>
          <li class="nav-item">
            <button
              v-if="currentPath !== 'login' && currentPath !== 'signup'"
              class="nav-link"
              @click="logoutUser"
            >
              <arrow-right-start-on-rectangle-icon
                class="me-2"
                style="width: 1.25rem; height: 1.25rem"
              />
              Logout
            </button>
            <button
              v-if="currentPath === 'signup'"
              class="nav-link"
              @click="$router.push({ name: 'Login' })"
            >
              Login
            </button>
            <button
              v-if="currentPath === 'login'"
              class="nav-link"
              @click="$router.push({ name: 'Signup' })"
            >
              Signup
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.router-link-active {
  color: var(--bs-primary);
}
</style>
