<template>
  <FormModal
    :title="`Edit ${workspace.name}`"
    :form="workspaceForm"
    description="Edit workspace info."
    :onSubmit="onSubmit"
  >
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
      <div class="mt-7">
        <CheckboxField
          field-name="isActive"
          label="Is active"
          description="Active workspaces actions are editable and visible to users."
        />
      </div>
    </div>
  </FormModal>
</template>

<script setup lang="ts">
import type { DetailedWorkspace, Workspace } from '@@types'
import { useWorkspaceDetailedForm } from './useWorkspaceDetailedForm'
import jumper from '@/services/jumper'
import { useToast } from '@@materials/ui/toast'
import { FormModal } from '@@materials/modal'
import { InputField, CheckboxField, TextareaField } from '@@materials/input'
import PermissionTagsField from '@/components/BackOfficePage/@common/PermissionTagsField.vue'

const { toast } = useToast()

const props = defineProps<{
  workspace: DetailedWorkspace
}>()

const workspaceForm = useWorkspaceDetailedForm(props.workspace)

const emit = defineEmits<{ workspaceUpdated: [workspace: Workspace] }>()

const onSubmit = workspaceForm.handleSubmit(async (values) => {
  try {
    const workspaceUpdated = await jumper.workspaces.update(
      props.workspace.id,
      {
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
      }
    )
    emit('workspaceUpdated', workspaceUpdated)
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to update workspace.',
        description: error.message,
        variant: 'destructive'
      })
    }
    return false
  }
  toast({
    title: `'${values.name}' workspace updated.`
  })
  return true
})
</script>
