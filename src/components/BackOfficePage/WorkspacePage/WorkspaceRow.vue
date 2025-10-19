<template>
  <TableCell class="w-[250px]">
    <div
      class="flex w-full gap-4 text-lg font-semibold text-slate-700 dark:text-slate-400"
    >
      {{ workspace.name }}
    </div>
  </TableCell>
  <TableCell class="w-[50px]" v-if="!activeOnly"
    ><Check
      class="text-slate-700 dark:text-slate-400"
      v-if="workspace.isActive"
      :size="20"
  /></TableCell>
  <TableCell>
    <div class="flex justify-end">
      <WorkspaceDropdownMenuButton
        :workspace="workspace"
        @workspace-updated="(e) => $emit('workspaceUpdated', e)"
      />
    </div>
  </TableCell>
</template>

<script setup lang="ts">
import type { DetailedWorkspace } from '@@types'
import { Check } from 'lucide-vue-next'
import { TableCell } from '@@materials/ui/table'
import WorkspaceDropdownMenuButton from './modals/WorkspaceDropdownMenuButton.vue'

defineEmits<{
  workspaceUpdated: [workspace?: DetailedWorkspace]
}>()

defineProps<{
  workspace: DetailedWorkspace
  activeOnly: boolean
}>()
</script>
