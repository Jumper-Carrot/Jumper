<template>
  <Dialog v-model:open="open" :modal="false">
    <DialogTrigger v-if="$slots.trigger" :class="props.class">
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent
      class="mt-[15px] flex max-h-[80%] w-11/12 max-w-[600px] flex-col gap-3
        dark:bg-slate-900"
      :disable-outside-pointer-events="false"
      :trap-focus="false"
      @interact-outside.prevent
    >
      <DialogHeader class="shrink-0">
        <slot name="header">
          <DialogTitle class="text-2xl font-semibold dark:text-slate-200">{{
            title
          }}</DialogTitle>
          <DialogDescription v-if="description" class="text-slate-500">
            {{ description }}
          </DialogDescription>
        </slot>
      </DialogHeader>
      <slot />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { HTMLAttributes } from 'vue'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@@materials/ui/dialog'

const open = defineModel<boolean>('open')

const props = defineProps<{
  title: string
  description?: string
  submitButtonName?: string
  class?: HTMLAttributes['class']
}>()
</script>
