<template>
  <FormModal
    title="New role"
    :form="roleForm"
    description="Create a new role."
    :onSubmit="onSubmit"
  >
    <template #trigger>
      <Button
        variant="outline"
        size="sm"
        class="text-slate-700 dark:text-slate-300"
        ><UserCog />Add Role</Button
      >
    </template>
    <template #default>
      <div class="flex flex-col">
        <InputField field-name="name" label="Name" />
        <TextareaField field-name="description" label="Description" />
        <TagsField
          field-name="users"
          label="Users"
          :disable-key-enter="true"
          v-model:search-term="usersSearch"
        >
          <template #default="{ item }">
            <span class="flex items-center gap-1 px-1">
              <UserIcon :size="16" />
              {{ item.value.username }}
            </span>
          </template>
          <template #search-list="{ items, addTag }">
            <Loader2
              class="text-primary m-auto my-1 h-10 animate-spin"
              v-if="usersSearch && (isUsersFetching || isUsersSearchDebouncing)"
            />
            <template v-else v-for="user in usersPage?.results" :key="user.id">
              <CommandItem
                v-if="!items.some(item => item.value.id === user.id)"
                class="flex gap-1"
                :value="
                  user.username + user.firstName + user.lastName + user.email
                "
                @select.prevent="addTag(user)"
              >
                <UserIcon :size="16" />
                <p>{{ user.username }}</p>
              </CommandItem>
            </template>
          </template>
        </TagsField>
        <TagsField
          v-if="isScimEnabled"
          field-name="groups"
          label="Groups"
          :disable-key-enter="true"
          v-model:search-term="groupsSearch"
        >
          <template #default="{ item }">
            <span class="flex items-center gap-1 px-1">
              <UsersIcon :size="16" />
              {{ item.value.name }}
            </span>
          </template>
          <template #search-list="{ items, addTag }">
            <Loader2
              class="text-primary m-auto my-1 h-10 animate-spin"
              v-if="
                groupsSearch && (isGroupsFetching || isGroupsSearchDebouncing)
              "
            />
            <template v-for="group in groupsPage?.results" :key="group.id">
              <CommandItem
                v-if="!items.some(item => item.value.id === group.id)"
                class="flex gap-1"
                :value="group.name"
                @select.prevent="addTag(group)"
              >
                <UsersIcon :size="16" />
                <p>{{ group.name }}</p>
              </CommandItem>
            </template>
          </template>
        </TagsField>
      </div>
    </template>
  </FormModal>
</template>

<script setup lang="ts">
import { Action, Group, User } from '@@types'
import { Loader2, UserCog, UserIcon, UsersIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import jumper from '@/services/jumper'
import { useBackendInfoStore } from '@/stores'
import { useGroupsQuery } from '@/composables/query/useGroupsQuery'
import { useUsersQuery } from '@/composables/query/useUsersQuery'

import { InputField, TagsField, TextareaField } from '@@materials/input'
import { FormModal } from '@@materials/modal'
import { Button } from '@@materials/ui/button'
import { CommandItem } from '@@materials/ui/command'
import { useToast } from '@@materials/ui/toast'
import { useRoleForm } from './useRoleForm'

const { toast } = useToast()

const roleForm = useRoleForm()
const { isScimEnabled } = storeToRefs(useBackendInfoStore())

const emit = defineEmits<{ roleAdded: [] }>()

const {
  data: usersPage,
  search: usersSearch,
  isFetching: isUsersFetching,
  isSearchDebouncing: isUsersSearchDebouncing
} = useUsersQuery({
  limit: 100,
  searchDebounceTime: 400,
  searchNeeded: true
})

const {
  data: groupsPage,
  search: groupsSearch,
  isFetching: isGroupsFetching,
  isSearchDebouncing: isGroupsSearchDebouncing
} = useGroupsQuery({
  limit: 100,
  searchDebounceTime: 400,
  searchNeeded: true
})

const onSubmit = roleForm.handleSubmit(async values => {
  try {
    await jumper.roles.create({
      name: values.name,
      description: values.description,
      users: values.users?.map((user: User) => user.id),
      groups: values.groups?.map((group: Group) => group.id),
      actions: values.actions?.map((action: Action) => action.id)
    })
    emit('roleAdded')
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to create role.',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  toast({
    title: `"${values.name}" role created.`
  })
  return true
})
</script>
