<script setup lang="ts">
import type { TagsInputItemTextProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'
import { TagsInputItemText, useForwardProps } from 'radix-vue'

import { cn } from '@/services/utils'

const props = defineProps<
  TagsInputItemTextProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItemText
    v-bind="forwardedProps"
    :class="cn('rounded bg-transparent px-2 py-1 text-sm', props.class)"
  />
</template>
