<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button
        variant="ghost"
        class="rounded-sm px-3 text-slate-700 hover:bg-slate-100
          dark:text-slate-300 dark:hover:bg-slate-600"
      >
        <MoreHorizontal />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="flex flex-col">
      <DropdownMenuItem
        @click="editWorkspaceModalOpen = true"
        class="cursor-pointer"
        ><p>Edit workspace</p></DropdownMenuItem
      >
      <DropdownMenuItem
        class="cursor-pointer"
        @click="deleteWorkspaceModalOpen = true"
        ><p class="text-destructive">Delete workspace</p></DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
  <EditWorkspaceModal
    v-if="editWorkspaceModalOpen"
    v-model:open="editWorkspaceModalOpen"
    @workspace-updated="() => $emit('workspaceUpdated')"
    :workspace="workspace"
  />
  <DeleteWorkspaceModal
    v-if="deleteWorkspaceModalOpen"
    v-model:open="deleteWorkspaceModalOpen"
    @workspace-deleted="$emit('workspaceUpdated')"
    :workspace="workspace"
  />
</template>

<script lang="ts" setup>
import type { DetailedWorkspace } from '@@types'

import { onMounted, ref, watch } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

import { Button } from '@@materials/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@@materials/ui/dropdown-menu'
import DeleteWorkspaceModal from './DeleteWorkspaceModal.vue'
import EditWorkspaceModal from './EditWorkspaceModal.vue'

const router = useRouter()
const props = defineProps<{ workspace: DetailedWorkspace }>()
const editWorkspaceModalOpen = ref(false)
const deleteWorkspaceModalOpen = ref(false)

defineEmits<{
  workspaceUpdated: [workspace?: DetailedWorkspace]
}>()

watch(editWorkspaceModalOpen, open => {
  if (!open) {
    router.push({ name: 'workspaces' })
  } else {
    router.push({
      name: 'workspace-edit',
      params: { id: String(props.workspace.id) }
    })
  }
})

watch(deleteWorkspaceModalOpen, open => {
  if (!open) {
    router.push({ name: 'workspaces' })
  } else {
    router.push({
      name: 'workspace-delete',
      params: { id: String(props.workspace.id) }
    })
  }
})

onMounted(() => {
  editWorkspaceModalOpen.value =
    router.currentRoute.value.name === 'workspace-edit' &&
    router.currentRoute.value.params.id === String(props.workspace.id)
  deleteWorkspaceModalOpen.value =
    router.currentRoute.value.name === 'workspace-delete' &&
    router.currentRoute.value.params.id === String(props.workspace.id)
})
</script>
