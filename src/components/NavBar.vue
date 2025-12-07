<script setup lang="ts">
import { logout } from '@/api/authorization'
import { useAuthorizationStore } from '@/stores/authorization'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRightStartOnRectangleIcon, ShoppingBagIcon } from '@heroicons/vue/24/solid'

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

watch(
  () => route.path,
  () => {
    isOpen.value = false
  },
)
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-white shadow-sm position-sticky top-0 z-1">
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
            <router-link class="nav-link" to="/my-products" :hidden="auth.role === 'BUYER'">
              My Products
            </router-link>
          </li>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item me-5">
            <router-link class="nav-link position-relative p-0 m-2" to="/cart">
              <shopping-bag-icon style="height: 1.5rem; width: 1.5rem" />
              <span class="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                {{ auth.cart.products?.length || 0 }}
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
