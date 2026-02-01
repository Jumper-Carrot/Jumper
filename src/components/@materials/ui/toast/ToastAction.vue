<script setup lang="ts">
import type { ToastActionProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'
import { ToastAction } from 'radix-vue'

import { cn } from '@/services/utils'

const props = defineProps<
  ToastActionProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ToastAction
    v-bind="delegatedProps"
    :class="
      cn(
        `ring-offset-background hover:bg-secondary focus:ring-ring
        group-[.destructive]:border-muted/40
        hover:group-[.destructive]:border-destructive/30
        hover:group-[.destructive]:bg-destructive
        hover:group-[.destructive]:text-destructive-foreground
        focus:group-[.destructive]:ring-destructive inline-flex h-8 shrink-0
        items-center justify-center rounded-md border bg-transparent px-3
        text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2
        focus:outline-hidden disabled:pointer-events-none disabled:opacity-50`,
        props.class
      )
    "
  >
    <slot />
  </ToastAction>
</template>
