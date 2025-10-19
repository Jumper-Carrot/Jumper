import type {
  DetailedWorkspace,
  User,
  DetailedGroup,
  DetailedRole
} from '@@types'
import { computed, MaybeRefOrGetter, toRef, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export type WorkspaceDetailedForm = ReturnType<typeof useWorkspaceDetailedForm>

export const useWorkspaceDetailedForm = (
  workspace: MaybeRefOrGetter<DetailedWorkspace | null> = null
) => {
  const workspaceRef = toRef(workspace)

  const workspaceSchema = computed(() =>
    toTypedSchema(
      z.object({
        name: z.string().min(2).max(25),
        description: z.string().max(500).optional(),
        isActive: z.boolean().optional(),
        permissions: z
          .array(z.custom<User | DetailedGroup | DetailedRole>())
          .default([])
      })
    )
  )

  const getInitialValues = (newValue: DetailedWorkspace | null) => {
    if (newValue) {
      return {
        name: newValue.name,
        description: newValue.description,
        isActive: newValue.isActive,
        permissions: [...newValue.users, ...newValue.groups, ...newValue.roles]
      }
    }
  }

  const form = useForm({
    validationSchema: workspaceSchema,
    initialValues: getInitialValues(workspaceRef.value),
    keepValuesOnUnmount: true
  })

  watch(workspaceRef, (newValue) => {
    if (!newValue) return
    form.resetForm()
    form.setValues(getInitialValues(newValue) ?? {})
  })

  return form
}
