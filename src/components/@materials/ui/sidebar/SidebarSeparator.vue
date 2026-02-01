<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/services/utils'

import { Separator } from '@/components/@materials/ui/separator'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Separator
    data-sidebar="separator"
    :class="cn('bg-sidebar-border mx-2 w-auto', props.class)"
  >
    <slot />
  </Separator>
</template>
