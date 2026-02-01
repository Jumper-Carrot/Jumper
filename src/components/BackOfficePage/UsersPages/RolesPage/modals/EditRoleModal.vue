<template>
  <FormModal
    :title="`Edit ${role.name}`"
    :form="userForm"
    description="Edit user info."
    :onSubmit="onSubmit"
  >
    <div class="flex flex-col">
      <InputField field-name="name" type="name" label="Name" />
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
  </FormModal>
</template>

<script setup lang="ts">
import type { DetailedRole, Group, Role, User } from '@@types'

import { Loader2, UserIcon, UsersIcon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import jumper from '@/services/jumper'
import { useBackendInfoStore } from '@/stores'
import { useGroupsQuery } from '@/composables/query/useGroupsQuery'
import { useUsersQuery } from '@/composables/query/useUsersQuery'

import { InputField, TagsField, TextareaField } from '@@materials/input'
import { FormModal } from '@@materials/modal'
import { CommandItem } from '@@materials/ui/command'
import { useToast } from '@@materials/ui/toast'
import { useRoleForm } from './useRoleForm'

const { toast } = useToast()

const props = defineProps<{
  role: DetailedRole
}>()

const userForm = useRoleForm(props.role)
const { isScimEnabled } = storeToRefs(useBackendInfoStore())

const emit = defineEmits<{ roleUpdated: [role: Role] }>()

const onSubmit = userForm.handleSubmit(async values => {
  try {
    const roleUpdated = await jumper.roles.update(props.role.id, {
      ...values,
      users: values.users.map((user: User) => user.id),
      groups: values.groups.map((group: Group) => group.id)
    })
    emit('roleUpdated', roleUpdated)
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to update user.',
        description: error.message,
        variant: 'destructive'
      })
    }
    return false
  }
  toast({
    title: `'${values.name}' role updated.`
  })
  return true
})

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
</script>
