<template>
  <ConfirmModal
    :onConfirm="deleteBackgroundImage"
    title="Delete default background image"
    confirmButtonName="Delete"
    confirmButtonVariant="destructive"
  >
    <template #trigger>
      <Button
        size="sm"
        variant="outline"
        class="border-red-500 text-red-500 hover:text-red-600"
        :disabled="disabled"
      >
        <Trash2 class="h-6 w-6" />
        Delete default background image
      </Button>
    </template>
    <h2 class="font-semibold">
      Are you sure you want to delete this default background image?
    </h2>
    <p class="text-slate-800 dark:text-slate-400">
      You will permanently delete this default background image. This action
      cannot be undone.
    </p>
    <template #confirm-button>
      <Trash2 class="h-6 w-6" />
      Delete
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'

import { useSystemStore } from '@/stores'
import { useConfirmToast } from '@/composables'

import { ConfirmModal } from '@@materials/modal'
import { Button } from '@@materials/ui/button'

defineProps<{
  disabled: boolean
}>()

const systemStore = useSystemStore()

const deleteBackgroundImage = async () => {
  return await useConfirmToast(
    async () => {
      await systemStore.deleteDefaultBackgroundImage()
      return true
    },
    {
      errorTitle: 'Failed to delete default background image'
    }
  )
}
</script>
