<script setup lang="ts">
import type { PaginationNextProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { PaginationNext } from 'radix-vue'

import { cn } from '@/services/utils'

import { Button } from '@/components/@materials/ui/button'

const props = withDefaults(
  defineProps<PaginationNextProps & { class?: HTMLAttributes['class'] }>(),
  {
    asChild: true
  }
)

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <PaginationNext v-bind="delegatedProps">
    <Button :class="cn('h-10 w-10 p-0', props.class)" variant="outline">
      <slot>
        <ChevronRight class="h-4 w-4" />
      </slot>
    </Button>
  </PaginationNext>
</template>
