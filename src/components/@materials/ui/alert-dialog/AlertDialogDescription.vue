<script setup lang="ts">
import type { AlertDialogDescriptionProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'
import { AlertDialogDescription } from 'radix-vue'

import { cn } from '@/services/utils'

const props = defineProps<
  AlertDialogDescriptionProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogDescription
    v-bind="delegatedProps"
    :class="cn('text-muted-foreground text-sm', props.class)"
  >
    <slot />
  </AlertDialogDescription>
</template>
