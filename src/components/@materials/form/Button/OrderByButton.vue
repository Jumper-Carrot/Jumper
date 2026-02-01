<template>
  <Button
    @click="changeOrder"
    variant="ghost"
    class="relative -left-1 gap-1 p-2"
  >
    <slot />
    <ChevronDown
      class="transition-transform"
      :size="18"
      v-if="order?.field === props.field"
      :class="{
        'rotate-180': order?.direction === 'desc'
      }"
    />
  </Button>
</template>

<script setup lang="ts">
import type { Order } from '@@types'

import { ChevronDown } from 'lucide-vue-next'

import { Button } from '@@materials/ui/button'

const order = defineModel<Order | null>('order', {
  default: null
})
const props = defineProps<{
  field: string
  disableDesc?: boolean
}>()

const changeOrder = () => {
  if (order.value && order.value.field === props.field && !props.disableDesc) {
    order.value.direction = order.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    order.value = {
      field: props.field,
      direction: 'asc'
    }
  }
}
</script>
