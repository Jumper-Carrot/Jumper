<template>
  <FormField v-slot="{ componentField }" :name="fieldName">
    <FormItem class="flex w-full flex-col space-y-0">
      <FormLabel v-if="fieldLabel" class="mb-1 ml-1 dark:text-slate-200">{{
        fieldLabel
      }}</FormLabel>
      <FormControl>
        <Select
          v-bind="{
            ...componentField,
            ...$slots,
            ...{
              items,
              itemKey,
              label,
              placeholder,
              search,
              clear,
              loading,
              description,
              class: props.class,
              variant,
              size,
              commandListClass,
              disabled
            }
          }"
        >
        </Select>
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

<script setup lang="ts" generic="T, U">
import type { HTMLAttributes } from 'vue'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@@materials/ui/form'
import { Select, type SelectVariants } from './Select'

const props = withDefaults(
  defineProps<{
    fieldLabel: string
    fieldName: string
    items: T[]
    itemKey?: keyof T | ((item: T) => U)
    label?: keyof T | ((item: T) => string)
    placeholder?: string
    search?: boolean
    clear?: boolean
    loading?: boolean
    showErrorMessage?: boolean
    description?: string
    class?: HTMLAttributes['class']
    variant?: SelectVariants['variant']
    size?: SelectVariants['size']
    commandListClass?: HTMLAttributes['class']
    disabled?: boolean
  }>(),
  {
    showErrorMessage: true,
    getValue: (item: T) => item
  }
)
</script>
