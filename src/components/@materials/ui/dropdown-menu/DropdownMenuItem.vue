<script setup lang="ts">
import type { DropdownMenuItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'
import { DropdownMenuItem, useForwardProps } from 'radix-vue'

import { cn } from '@/services/utils'

const props = defineProps<
  DropdownMenuItemProps & { class?: HTMLAttributes['class']; inset?: boolean }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DropdownMenuItem
    v-bind="forwardedProps"
    :class="
      cn(
        `focus:bg-accent focus:text-accent-foreground relative flex w-full
        cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm
        outline-hidden transition-colors select-none
        data-disabled:pointer-events-none data-disabled:opacity-50
        [&>svg]:size-4 [&>svg]:shrink-0`,
        inset && 'pl-8',
        props.class
      )
    "
  >
    <slot />
  </DropdownMenuItem>
</template>
