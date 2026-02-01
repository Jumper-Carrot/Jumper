<template>
  <BaseModal
    :title="`'${role.name}' groups`"
    v-model:open="open"
    class="w-[500px] p-6"
  >
    <div class="flex min-h-0 flex-1 flex-col space-y-3">
      <div class="relative w-full items-center">
        <Input
          size="sm"
          placeholder="Search a group..."
          class="max-h-10 pl-9"
          v-model="search"
        />
        <span
          class="absolute inset-y-0 start-0 flex items-center justify-center
            px-2"
        >
          <Search class="text-muted-foreground size-5" />
        </span>
      </div>
      <div
        class="min-h-[100px] flex-1 overflow-y-auto rounded-lg border
          shadow-inner"
        v-bind="containerProps"
      >
        <div v-bind="wrapperProps">
          <Table>
            <TableCaption v-if="!filteredGroups?.length"
              >No group found</TableCaption
            >
            <TableBody>
              <TableRow v-for="group in showedGroups" :key="group.data.id">
                <TableCell>
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center
                        rounded-full bg-slate-200 text-slate-600
                        dark:bg-slate-700 dark:text-slate-300"
                    >
                      <p class="text-lg font-semibold">
                        {{ group.data.name.charAt(0).toUpperCase() }}
                      </p>
                    </div>
                    <div class="flex flex-col">
                      <p class="font-medium text-slate-700 dark:text-slate-200">
                        {{ group.data.name }}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import type { DetailedRole } from '@@types'

import { computed, ref } from 'vue'
import { useVirtualList } from '@vueuse/core'
import { Search } from 'lucide-vue-next'

import { Input } from '@@materials/form'
import BaseModal from '@@materials/modal/BaseModal.vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow
} from '@@materials/ui/table'

const props = defineProps<{
  role: DetailedRole
}>()

const open = defineModel<boolean>('open')

const search = ref('')

const filteredGroups = computed(() => {
  if (!search.value) {
    return props.role.groups
  }
  return props.role.groups.filter(group =>
    group.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const {
  list: showedGroups,
  wrapperProps,
  containerProps
} = useVirtualList(filteredGroups, {
  itemHeight: 72.5
})
</script>
