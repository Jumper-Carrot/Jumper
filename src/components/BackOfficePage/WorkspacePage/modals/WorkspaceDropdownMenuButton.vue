<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button
        variant="ghost"
        class="rounded-sm px-3 text-slate-700 hover:bg-slate-100 dark:text-slate-300
          dark:hover:bg-slate-600"
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
      <DropdownMenuItem class="cursor-pointer"
        ><p class="text-destructive" @click="deleteWorkspaceModalOpen = true">
          Delete workspace
        </p></DropdownMenuItem
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
import { ref } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@@materials/ui/dropdown-menu'
import EditWorkspaceModal from './EditWorkspaceModal.vue'
import DeleteWorkspaceModal from './DeleteWorkspaceModal.vue'

const editWorkspaceModalOpen = ref(false)
const deleteWorkspaceModalOpen = ref(false)

defineProps<{
  workspace: DetailedWorkspace
}>()

defineEmits<{
  workspaceUpdated: [workspace?: DetailedWorkspace]
}>()
</script>
