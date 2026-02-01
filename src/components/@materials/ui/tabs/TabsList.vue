<script setup lang="ts">
import type { TabsListProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { reactiveOmit } from '@vueuse/core'
import { TabsList } from 'reka-ui'

import { cn } from '@/services/utils'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="
      cn(
        `bg-muted text-muted-foreground inline-flex items-center justify-center
        rounded-md p-1`,
        props.class
      )
    "
  >
    <slot />
  </TabsList>
</template>
