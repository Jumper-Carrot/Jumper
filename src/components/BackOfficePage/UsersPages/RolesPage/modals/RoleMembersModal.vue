<template>
  <BaseModal
    :title="`'${role.name}' members`"
    v-model:open="open"
    class="w-[500px] p-6"
  >
    <div class="flex min-h-0 flex-1 flex-col space-y-3">
      <div class="relative w-full items-center">
        <Input
          size="sm"
          placeholder="Search a member..."
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
            <TableCaption v-if="!filteredMembers?.length"
              >No member found</TableCaption
            >
            <TableBody>
              <TableRow v-for="member in showedMembers" :key="member.data.id">
                <TableCell>
                  <div class="flex items-center gap-3">
                    <img
                      v-if="member.data.profilePictureUrl"
                      :src="member.data.profilePictureUrl"
                      :alt="member.data.username"
                    />
                    <div
                      v-else
                      class="flex h-10 w-10 items-center justify-center
                        rounded-full bg-slate-200 text-slate-600
                        dark:bg-slate-700 dark:text-slate-300"
                    >
                      <p class="text-lg font-semibold">
                        {{ member.data.username.charAt(0).toUpperCase() }}
                      </p>
                    </div>
                    <div class="flex flex-col">
                      <p class="font-medium text-slate-700 dark:text-slate-200">
                        {{ member.data.username }}
                      </p>
                      <p class="text-sm text-slate-500 dark:text-slate-400">
                        {{ member.data.email }}
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

const filteredMembers = computed(() => {
  if (!search.value) {
    return props.role.users
  }
  return props.role.users.filter(member =>
    member.username.toLowerCase().includes(search.value.toLowerCase())
  )
})

const {
  list: showedMembers,
  wrapperProps,
  containerProps
} = useVirtualList(filteredMembers, {
  itemHeight: 72.5
})
</script>
