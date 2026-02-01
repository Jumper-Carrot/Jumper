<template>
  <FormField v-slot="{ componentField }" :name="fieldName">
    <FormItem :class="cn('w-full space-y-0', props.class)">
      <FormLabel v-if="label" class="ml-1 dark:text-slate-200">{{
        label
      }}</FormLabel>
      <FormControl>
        <Input
          class="placeholder:text-sm"
          v-bind="{
            ...componentField,
            ...$attrs
          }"
        />
      </FormControl>
      <FormDescription v-if="description" class="ml-1 dark:text-slate-500">{{
        description
      }}</FormDescription>
      <div v-if="showErrorMessage" class="h-6 pl-1">
        <FormMessage />
      </div>
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/services/utils'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@@materials/ui/form'
import Input from '@@materials/ui/input/Input.vue'

const props = withDefaults(
  defineProps<{
    fieldName: string
    label?: string
    class?: HTMLAttributes['class']
    showErrorMessage?: boolean
    description?: string
  }>(),
  {
    showErrorMessage: true
  }
)
</script>
