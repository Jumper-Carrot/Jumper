<template>
  <BaseModal
    :title="`'${action.name}' allowed users`"
    v-model:open="open"
    class="w-[500px] p-6"
  >
    <div class="flex min-h-0 flex-1 flex-col space-y-3">
      <div class="relative w-full items-center">
        <Input
          size="sm"
          placeholder="Search a user..."
          class="max-h-10 pl-9"
          v-model="search"
          @input="scrollTo(0)"
        />
        <span
          class="absolute inset-y-0 start-0 flex items-center justify-center
            px-2"
        >
          <Search class="text-muted-foreground size-5" />
        </span>
      </div>
      <div
        class="relative min-h-[100px] flex-1 overflow-x-hidden overflow-y-auto
          rounded-lg border shadow-inner"
        v-bind="containerProps"
      >
        <div v-bind="wrapperProps">
          <Table class="w-full table-fixed">
            <TableCaption v-if="!showedUsers?.length"
              >No user found</TableCaption
            >
            <TableBody>
              <TableRow v-for="user in showedUsers" :key="user.data.id">
                <TableCell>
                  <div class="flex items-center gap-3">
                    <img
                      v-if="user.data.profilePictureUrl"
                      :src="user.data.profilePictureUrl"
                      :alt="user.data.username"
                    />
                    <div
                      v-else
                      class="flex h-10 w-10 items-center justify-center
                        rounded-full bg-slate-200 text-slate-600
                        dark:bg-slate-700 dark:text-slate-300"
                    >
                      <p class="text-lg font-semibold">
                        {{ user.data.username.charAt(0).toUpperCase() }}
                      </p>
                    </div>
                    <div class="flex flex-col">
                      <p class="font-medium text-slate-700 dark:text-slate-200">
                        {{ user.data.username }}
                      </p>
                      <p class="text-sm text-slate-500 dark:text-slate-400">
                        {{ user.data.email }}
                      </p>
                    </div>
                    <div
                      class="ml-3 min-w-0 flex-1 text-right text-sm
                        text-slate-500"
                    >
                      <p
                        v-if="user.data.via.roles.length"
                        class="truncate"
                        :title="`Via role(s): ${user.data.via.roles.join(', ')}`"
                      >
                        Via role(s): {{ user.data.via.roles.join(', ') }}
                      </p>
                      <p
                        v-if="user.data.via.groups.length"
                        class="truncate"
                        :title="`Via group(s): ${user.data.via.groups.join(', ')}`"
                      >
                        Via group(s): {{ user.data.via.groups.join(', ') }}
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
import type { DetailedAction, Group, Role, ShortUser } from '@@types'

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
  action: DetailedAction
}>()

const open = defineModel<boolean>('open')

const search = ref('')

const filteredUsers = computed(() => {
  const getNewUser = (user: ShortUser) => ({
    ...user,
    via: {
      groups: [] as Group['name'][],
      roles: [] as Role['name'][]
    }
  })

  const usersIndex = props.action.users.reduce(
    (acc, user) => {
      acc[user.id] = getNewUser(user)
      return acc
    },
    {} as Record<
      ShortUser['id'],
      ShortUser & { via: { groups: Group['name'][]; roles: Role['name'][] } }
    >
  )
  props.action.groups.forEach(group => {
    group.userSet.forEach(user => {
      if (!usersIndex[user.id]) {
        usersIndex[user.id] = getNewUser(user)
      }
      usersIndex[user.id].via.groups.push(group.name)
    })
  })
  props.action.roles.forEach(role => {
    role.users.forEach(user => {
      if (!usersIndex[user.id]) {
        usersIndex[user.id] = getNewUser(user)
      }
      usersIndex[user.id].via.roles.push(role.name)
    })
  })

  const users = Object.values(usersIndex).sort((a, b) =>
    a.username.localeCompare(b.username)
  )

  if (!search.value) {
    return users
  }
  return users.filter(user =>
    user.username.toLowerCase().includes(search.value.toLowerCase())
  )
})

const {
  list: showedUsers,
  wrapperProps,
  containerProps,
  scrollTo
} = useVirtualList(filteredUsers, {
  itemHeight: 72.5
})
</script>
