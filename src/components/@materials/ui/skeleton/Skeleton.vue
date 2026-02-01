<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/services/utils'

interface SkeletonProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<SkeletonProps>()
</script>

<template>
  <div :class="cn('bg-muted animate-pulse rounded-md', props.class)" />
</template>
