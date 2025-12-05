<script lang="ts" setup>
import { signup } from '@/api/authorization'
import { isError } from '@/helpers/utils'
import type { UserCredentials } from '@/models/users'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const credentials = ref<UserCredentials>({} as UserCredentials)

const errorMessage = ref<string>('')
const router = useRouter()

async function handleSignUp() {
  const response = await signup(credentials.value)

  if (isError(response)) {
    errorMessage.value = response.error.join(', ')
    return
  }

  router.push({ name: 'Login' })
}
</script>

<template>
  <section
    id="signup"
    class="d-flex flex-column justify-content-center align-items-center flex-fill"
  >
    <div class="card p-4 shadow" style="min-width: 22rem">
      <h2 class="card-title text-center mb-4">Sign Up</h2>
      <form @submit.prevent="handleSignUp">
        <div class="mb-3">
          <label for="name" class="form-label">
            Display Name
            <span class="text-danger">*</span>
          </label>
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="Enter username"
            v-model="credentials.name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="username" class="form-label">
            Username
            <span class="text-danger">*</span>
          </label>
          <input
            type="username"
            class="form-control"
            id="username"
            placeholder="Enter username"
            v-model="credentials.username"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">
            Password
            <span class="text-danger">*</span>
          </label>
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="Enter Password"
            v-model="credentials.password"
            required
          />
        </div>
        <div class="mb-3">
          <label for="role" class="form-label">
            Role
            <span class="text-danger">*</span>
          </label>
          <select class="form-select" id="role" v-model="credentials.role" required>
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
          </select>
        </div>
        <div class="mb-3 text-danger" v-if="errorMessage">{{ errorMessage }}</div>
        <button type="submit" class="btn btn-primary w-100 mt-4">Sign Up</button>
      </form>
    </div>
  </section>
</template>
