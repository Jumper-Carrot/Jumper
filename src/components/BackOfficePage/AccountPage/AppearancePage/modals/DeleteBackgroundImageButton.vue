<template>
  <ConfirmModal
    :onConfirm="deleteBackgroundImage"
    title="Delete default background image"
    confirmButtonName="Delete"
    confirmButtonVariant="destructive"
  >
    <template #trigger>
      <Button
        v-if="small"
        size="sm"
        variant="outline"
        class="size-6 border-none bg-transparent p-0 text-slate-700 shadow-none
          dark:text-slate-400"
        title="Delete custom background image"
      >
        <ImageOff />
      </Button>
      <Button
        v-else
        size="sm"
        variant="outline"
        class="border-red-500 text-red-500 hover:text-red-600"
      >
        <Trash2 class="h-6 w-6" />
        Delete custom background image
      </Button>
    </template>
    <h2 class="font-semibold">
      Are you sure you want to delete this custom background image?
    </h2>
    <p class="text-slate-800 dark:text-slate-400">
      You will permanently delete this custom background image. This action
      cannot be undone.
    </p>
    <template #confirm-button>
      <Trash2 class="h-6 w-6" />
      Delete
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import { Trash2, ImageOff } from 'lucide-vue-next'

import { useAuthUserStore } from '@/stores'
import { useConfirmToast } from '@/composables'

import { ConfirmModal } from '@@materials/modal'
import { Button } from '@@materials/ui/button'

const authUserStore = useAuthUserStore()

defineProps<{
  small?: boolean
}>()

const deleteBackgroundImage = async () => {
  return await useConfirmToast(
    async () => {
      await authUserStore.deleteUserPreferenceBackgroundImage()
      return true
    },
    {
      errorTitle: 'Failed to delete gallery background image'
    }
  )
}
</script>
