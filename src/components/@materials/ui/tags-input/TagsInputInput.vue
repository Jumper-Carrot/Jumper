<script setup lang="ts">
import type { TagsInputInputProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'
import { TagsInputInput, useForwardProps } from 'radix-vue'

import { cn } from '@/services/utils'

const props = defineProps<
  TagsInputInputProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputInput
    v-bind="forwardedProps"
    :class="
      cn(
        'min-h-6 flex-1 bg-transparent px-1 text-sm focus:outline-hidden',
        props.class
      )
    "
  />
</template>
