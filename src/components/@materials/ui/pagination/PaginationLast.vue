<script setup lang="ts">
import type { PaginationLastProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'
import { ChevronsRight } from 'lucide-vue-next'
import { PaginationLast } from 'radix-vue'

import { cn } from '@/services/utils'

import { Button } from '@/components/@materials/ui/button'

const props = withDefaults(
  defineProps<PaginationLastProps & { class?: HTMLAttributes['class'] }>(),
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
  <PaginationLast v-bind="delegatedProps">
    <Button :class="cn('h-10 w-10 p-0', props.class)" variant="outline">
      <slot>
        <ChevronsRight class="h-4 w-4" />
      </slot>
    </Button>
  </PaginationLast>
</template>
