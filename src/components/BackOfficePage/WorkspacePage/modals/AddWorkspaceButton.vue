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
      </div>
    </template>
  </FormModal>
</template>

<script setup lang="ts">
import { useWorkspaceDetailedForm } from './useWorkspaceDetailedForm'
import jumper from '@/services/jumper'
import { useToast } from '@@materials/ui/toast'
import { ComponentIcon } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import { FormModal } from '@@materials/modal'
import { InputField, TextareaField } from '@@materials/input'
import PermissionTagsField from '@/components/BackOfficePage/@common/PermissionTagsField.vue'

const { toast } = useToast()

const workspaceForm = useWorkspaceDetailedForm()

const emit = defineEmits<{ workspaceAdded: [] }>()

const onSubmit = workspaceForm.handleSubmit(async (values) => {
  try {
    await jumper.workspaces.create({
      ...values,
      user_ids: values.permissions
        .filter((p) => 'username' in p)
        .map((p) => p.id),
      group_ids: values.permissions
        .filter((p) => 'isAdminGroup' in p)
        .map((p) => p.id),
      role_ids: values.permissions
        .filter((p) => 'description' in p)
        .map((p) => p.id)
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
