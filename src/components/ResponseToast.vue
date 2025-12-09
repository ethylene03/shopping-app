<script setup lang="ts">
const { type, message, id } = defineProps<{
  type: 'success' | 'error' | 'info'
  message: string
  id: string
}>()
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
      :id="`toast--component-${id}`"
      class="toast align-items-center border-0"
      :class="{
        'text-bg-primary': type === 'info',
        'text-bg-success': type === 'success',
        'text-bg-danger': type === 'error',
      }"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ message }}
        </div>
        <button
          type="button"
          class="btn-close me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>
