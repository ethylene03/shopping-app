<script setup lang="ts">
import type { Cart, CartItem } from '@/models/carts';
import type { Order, OrderItem } from '@/models/orders';
import type { Product } from '@/models/products';
import type { User } from '@/models/users';

type Data = Product | CartItem | Cart | Order | OrderItem | User

const { list, isLast } = defineProps<{
  list: Data[]
  isLast: boolean
}>()
</script>

<template>
  <span v-if="isLast && list.length > 0" class="text-muted w-100 text-center">
    No more products to show.
  </span>
  <span v-else-if="list.length > 0" class="text-primary w-100 text-center">
    Loading more products...
  </span>
</template>
