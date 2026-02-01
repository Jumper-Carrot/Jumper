<template>
  <Textarea
    :class="cn(textareaVariants({ variant, size, resize }), props.class)"
  />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/services/utils'

import { Textarea } from '@@materials/ui/textarea'
import { type TextareaVariants, textareaVariants } from '.'

const props = defineProps<{
  variant?: TextareaVariants['variant']
  size?: TextareaVariants['size']
  resize?: TextareaVariants['resize']
  class?: HTMLAttributes['class']
}>()
</script>
