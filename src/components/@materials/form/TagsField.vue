<template>
  <FormField :name="fieldName">
    <FormItem class="space-y-0">
      <FormLabel v-if="label" class="ml-1 dark:text-slate-200">{{
        label
      }}</FormLabel>
      <FormControl>
        <TagsInput
          :class="cn(props.class)"
          v-if="fields"
          v-model:search-term="searchTerm"
          v-model:tags="fields"
          :icon="icon"
          :create="create"
          :placeholder="placeholder"
          :disable-key-enter="disableKeyEnter"
          @press-enter="(tag, exist) => $emit('press-enter', tag, exist)"
        >
          <template #icon v-if="$slots['icon']">
            <slot name="icon" />
          </template>
          <template #default="{ item }" v-if="$slots['default']">
            <slot name="default" :item="item" />
          </template>
          <template
            #search-list="{ items, addTag, searchTerm }"
            v-if="$slots['search-list']"
          >
            <slot
              name="search-list"
              :searchTerm="searchTerm"
              :items="items"
              :addTag="addTag"
            />
          </template>
        </TagsInput>
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
import { type HTMLAttributes } from 'vue'
import { useField } from 'vee-validate'

import { cn } from '@/services/utils'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@@materials/ui/form'
import TagsInput from './TagsInput.vue'

const props = withDefaults(
  defineProps<{
    fieldName: string
    label?: string
    icon?: boolean
    create?: boolean
    placeholder?: string
    showErrorMessage?: boolean
    description?: string
    disableKeyEnter?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    icon: true,
    create: false,
    showErrorMessage: true
  }
)

defineEmits<{
  'press-enter': [tag: string, exist: boolean]
}>()

const { value: fields } = useField<any[]>(props.fieldName)
const searchTerm = defineModel<string>('search-term')
</script>
