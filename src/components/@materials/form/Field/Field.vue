<template>
  <FormField v-slot="field" :name="name">
    <FormItem :class="itemVariants({ variant })">
      <div class="flex items-center gap-1">
        <FormLabel v-if="label" :class="cn(labelVariants({ variant }))">
          {{ label }}<span v-if="required" class="-ml-0.5">*</span>
          <FieldTooltip v-if="$slots.tooltip" :name="name">
            <slot name="tooltip" />
          </FieldTooltip>
        </FormLabel>
      </div>
      <FormControl>
        <slot :field="field">
          <Input v-bind="field.componentField" type="text" />
        </slot>
      </FormControl>
      <FormDescription
        v-if="description"
        v-text="description"
        :class="cn(descriptionVariants({ variant }))"
      />
      <div v-if="error" :class="cn(errorVariants({ variant }))">
        <FormMessage />
      </div>
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { cn } from '@/services/utils'

import { Input } from '@@materials/form'
import {
  FormField,
  FormDescription,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel
} from '@@materials/ui/form'
import {
  itemVariants,
  labelVariants,
  descriptionVariants,
  errorVariants,
  type FieldVariants
} from '.'
import FieldTooltip from './FieldTooltip.vue'

defineProps<{
  name: string
  label?: string
  description?: string
  required?: boolean

  variant?: FieldVariants['variant']
  error?: boolean
}>()
</script>
