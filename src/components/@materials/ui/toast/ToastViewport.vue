<script setup lang="ts">
import type { ToastViewportProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'
import { ToastViewport } from 'radix-vue'

import { cn } from '@/services/utils'

const props = defineProps<
  ToastViewportProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ToastViewport
    v-bind="delegatedProps"
    :class="
      cn(
        `fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4
        sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]`,
        props.class
      )
    "
  />
</template>
