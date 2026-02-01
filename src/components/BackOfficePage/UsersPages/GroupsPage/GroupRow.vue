<template>
  <TableCell class="w-[250px]">
    <h3
      class="truncate overflow-hidden font-medium whitespace-nowrap
        text-slate-700 dark:text-slate-400"
      :title="group.name"
    >
      {{ group.name }}
    </h3>
  </TableCell>
  <TableCell class="w-[180px]">
    <Button
      variant="ghost"
      class="flex gap-1 p-2 text-slate-700 dark:text-slate-400"
      @click="isGroupMemberModalOpen = true"
    >
      {{ group.userSet.length }}
      <UserIcon class="h-6 w-6" />
    </Button>
  </TableCell>
  <TableCell></TableCell>
  <GroupMembersModal :group="group" v-model:open="isGroupMemberModalOpen" />
</template>

<script setup lang="ts">
import type { Group } from '@@types'

import { ref } from 'vue'
import { UserIcon } from 'lucide-vue-next'

import { Button } from '@@materials/ui/button'
import { TableCell } from '@@materials/ui/table'
import GroupMembersModal from './GroupMembersModal.vue'

const isGroupMemberModalOpen = ref(false)

defineProps<{
  group: Group
}>()
</script>
