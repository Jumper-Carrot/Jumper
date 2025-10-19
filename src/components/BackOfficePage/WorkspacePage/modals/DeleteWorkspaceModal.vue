<template>
  <ConfirmModal
    :onConfirm="deleteWorkspace"
    :title="`Delete '${props.workspace?.name}' workspace`"
    confirmButtonName="Delete"
    confirmButtonVariant="destructive"
  >
    <h2 class="font-semibold">
      Are you sure you want to delete '{{ props.workspace?.name }}' workspace ?
    </h2>
    <p class="text-slate-800 dark:text-slate-400">
      You will permanently delete this workspace. This action cannot be undone.
    </p>
    <template #confirm-button>
      <Trash2 class="h-6 w-6" />
      Delete
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import type { DetailedWorkspace } from '@@types'
import jumper from '@/services/jumper'
import { useConfirmToast } from '@/composables'
import { ConfirmModal } from '@@materials/modal'
import { Trash2 } from 'lucide-vue-next'

const emit = defineEmits<{
  workspaceDeleted: []
}>()
const props = defineProps<{
  workspace: DetailedWorkspace
}>()

const deleteWorkspace = async () => {
  return await useConfirmToast(
    async () => {
      await jumper.workspaces.remove(props.workspace?.id)
      emit('workspaceDeleted')
      return true
    },
    {
      successTitle: `'${props.workspace?.name}' workspace deleted.`,
      errorTitle: 'Failed to delete workspace'
    }
  )
}
</script>
