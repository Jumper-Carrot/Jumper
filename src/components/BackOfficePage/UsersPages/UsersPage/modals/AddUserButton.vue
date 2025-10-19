<template>
  <FormModal
    title="New user"
    :form="userForm"
    description="Create a new user"
    :onSubmit="onSubmit"
  >
    <template #trigger>
      <Button
        variant="outline"
        size="sm"
        class="text-slate-700 dark:text-slate-300"
        ><UserIcon />Add User</Button
      >
    </template>
    <template #default>
      <div class="flex flex-col">
        <InputField field-name="email" type="email" label="Email" />
        <InputField field-name="password" type="password" label="Password" />
        <InputField field-name="username" label="Username" />
        <InputField field-name="firstName" label="First Name" />
        <InputField field-name="lastName" label="Last Name" />
        <Label class="mb-1 ml-1">System Role</Label>
        <SystemRoleSelect v-model="systemRole" />
      </div>
    </template>
  </FormModal>
</template>

<script setup lang="ts">
import { useUserForm } from './useUserForm'
import jumper from '@/services/jumper'
import { useToast } from '@@materials/ui/toast'
import { UserIcon } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import { FormModal } from '@@materials/modal'
import { InputField } from '@@materials/input'
import SystemRoleSelect from '../SystemRoleSelect.vue'
import { useField } from 'vee-validate'
import { Label } from '@@materials/ui/label'
import { SystemRole } from '@@types/user'

const { toast } = useToast()

const userForm = useUserForm()

const emit = defineEmits<{ userAdded: [] }>()
const { value: systemRole } = useField<SystemRole>('systemRole')

const onSubmit = userForm.handleSubmit(async (values) => {
  try {
    await jumper.users.create(values)
    emit('userAdded')
  } catch (error) {
    if (error instanceof Error) {
      toast({
        title: 'Failed to create user.',
        description: error.message,
        variant: 'destructive'
      })
    }
  }
  toast({
    title: `"${values.username}" profile created.`
  })
  return true
})
</script>
