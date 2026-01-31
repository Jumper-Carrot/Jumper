<template>
  <BaseModal
    title="Action allowed users"
    v-model:open="open"
    class="p-6 w-[500px]"
  >
    <div class="flex flex-col space-y-3 flex-1 min-h-0">
      <div class="relative w-full items-center">
        <Input
          size="sm"
          placeholder="Search a user..."
          class="max-h-10 pl-9"
          v-model="search"
          @input="scrollTo(0)"
        />
        <span
          class="absolute inset-y-0 start-0 flex items-center justify-center px-2"
        >
          <Search class="size-5 text-muted-foreground" />
        </span>
      </div>
      <div
        class="flex-1 min-h-[100px] rounded-lg border shadow-inner overflow-y-auto overflow-x-hidden relative"
        v-bind="containerProps"
      >
        <div v-bind="wrapperProps">
          <Table class="table-fixed w-full">
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
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
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
                      class="flex-1 min-w-0 text-right text-sm text-slate-500 ml-3"
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
import type {
  DetailedGroup,
  DetailedRole,
  Group,
  Role,
  ShortUser
} from '@@types'
import type { Ref } from 'vue'

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
  permissions: Array<Ref<ShortUser> | Ref<DetailedGroup> | Ref<DetailedRole>>
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

  const usersList = props.permissions.filter(
    (item): item is Ref<ShortUser> =>
      (item as Ref<ShortUser>).value.username !== undefined
  )
  const groupsList = props.permissions.filter(
    (item): item is Ref<DetailedGroup> =>
      (item as Ref<DetailedGroup>).value.isAdminGroup !== undefined
  )
  const rolesList = props.permissions.filter(
    (item): item is Ref<DetailedRole> =>
      (item as Ref<DetailedRole>).value.users !== undefined
  )

  const usersIndex = usersList.reduce(
    (acc, user) => {
      acc[user.value.id] = getNewUser(user.value)
      return acc
    },
    {} as Record<
      ShortUser['id'],
      ShortUser & {
        via: { groups: DetailedGroup['name'][]; roles: DetailedRole['name'][] }
      }
    >
  )
  groupsList.forEach(group => {
    group.value.userSet.forEach(user => {
      if (!usersIndex[user.id]) {
        usersIndex[user.id] = getNewUser(user)
      }
      usersIndex[user.id].via.groups.push(group.value.name)
    })
  })
  rolesList.forEach(role => {
    role.value.users.forEach(user => {
      if (!usersIndex[user.id]) {
        usersIndex[user.id] = getNewUser(user)
      }
      usersIndex[user.id].via.roles.push(role.value.name)
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
