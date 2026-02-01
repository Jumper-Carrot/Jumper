<script setup lang="ts">
import type { PaginationEllipsisProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import { PaginationEllipsis } from 'radix-vue'

import { cn } from '@/services/utils'

const props = defineProps<
  PaginationEllipsisProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <PaginationEllipsis
    v-bind="delegatedProps"
    :class="cn('flex h-9 w-9 items-center justify-center', props.class)"
  >
    <slot>
      <MoreHorizontal />
    </slot>
  </PaginationEllipsis>
</template>
