<script setup lang="ts">
import type { SelectLabelProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

import { SelectLabel } from 'radix-vue'

import { cn } from '@/services/utils'

const props = defineProps<
  SelectLabelProps & { class?: HTMLAttributes['class'] }
>()
</script>

<template>
  <SelectLabel
    :class="cn('py-1.5 pr-2 pl-8 text-sm font-semibold', props.class)"
  >
    <slot />
  </SelectLabel>
</template>
