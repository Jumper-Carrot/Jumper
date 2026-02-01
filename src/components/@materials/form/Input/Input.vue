<template>
  <Input :class="cn(inputVariants({ variant, size }), props.class)" />
</template>

<script setup lang="ts">
import { type HTMLAttributes } from 'vue'

import { cn } from '@/services/utils'

import { Input } from '@@materials/ui/input'
import { type InputVariants, inputVariants } from '.'

const props = defineProps<{
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  class?: HTMLAttributes['class']
}>()
</script>
