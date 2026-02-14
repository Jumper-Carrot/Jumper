<template>
  <FormModal
    title="New workspace"
    :form="workspaceForm"
    description="Create a new workspace"
    :onSubmit="onSubmit"
  >
    <template #trigger>
      <Button
        variant="outline"
        size="sm"
        class="text-slate-700 dark:text-slate-300"
        @click="workspaceForm.resetForm()"
        ><ComponentIcon />Add Workspace</Button
      >
    </template>
    <template #default>
      <div class="flex flex-col">
        <InputField field-name="name" label="Name" />
        <TextareaField field-name="description" label="Description" />
        <PermissionTagsField
          field-name="permissions"
          label="Workspace managers"
          description="
          Only users listed here can manage and assign actions to this workspace. 
          Users that are not action managers or admin are ignored."
        />
        <PermissionTagsField
          field-name="actionPermissions"
          label="Action permissions"
          description="
          Users, groups and roles allowed to execute actions on this workspace."
        />
      </div>
    </template>
  </FormModal>
</template>

<script setup lang="ts">
import { ComponentIcon } from 'lucide-vue-next'

import jumper from '@/services/jumper'

import { InputField, TextareaField } from '@@materials/input'
import { FormModal } from '@@materials/modal'
import { Button } from '@@materials/ui/button'
import { useToast } from '@@materials/ui/toast'
import PermissionTagsField from '@/components/BackOfficePage/@common/PermissionTagsField.vue'
import { useWorkspaceDetailedForm } from './useWorkspaceDetailedForm'

const { toast } = useToast()

const workspaceForm = useWorkspaceDetailedForm()

const emit = defineEmits<{ workspaceAdded: [] }>()

const onSubmit = workspaceForm.handleSubmit(async values => {
  try {
    await jumper.workspaces.create({
      ...values,
      usersManagersIds: values.permissions
        .filter(p => 'username' in p)
        .map(p => p.id),
      groupsManagersIds: values.permissions
        .filter(p => 'isAdminGroup' in p)
        .map(p => p.id),
      rolesManagersIds: values.permissions
        .filter(p => 'description' in p)
        .map(p => p.id),
      actionsAllowedUsersIds: values.actionPermissions
        .filter(p => 'username' in p)
        .map(p => p.id),
      actionsAllowedGroupsIds: values.actionPermissions
        .filter(p => 'isAdminGroup' in p)
        .map(p => p.id),
      actionsAllowedRolesIds: values.actionPermissions
        .filter(p => 'description' in p)
        .map(p => p.id)
    })
    emit('workspaceAdded')
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to create workspace.',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  toast({
    title: `"${values.name}" workspace created.`
  })
  return true
})
</script>
