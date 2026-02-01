<script setup lang="ts">
import type { TagsInputItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { computed } from 'vue'
import { TagsInputItem, useForwardProps } from 'radix-vue'

import { cn } from '@/services/utils'

const props = defineProps<
  TagsInputItemProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItem
    v-bind="forwardedProps"
    :class="
      cn(
        `bg-secondary data-[state=active]:ring-ring ring-offset-background flex
        h-6 items-center rounded data-[state=active]:ring-2
        data-[state=active]:ring-offset-2`,
        props.class
      )
    "
  >
    <slot />
  </TagsInputItem>
</template>
