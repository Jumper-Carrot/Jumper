import type { DetailedAction } from '@@types'
import type { DetailedGroup, DetailedRole, User } from '@@types/user'

import { computed, MaybeRefOrGetter, toRef, watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

export type ActionDetailedForm = ReturnType<typeof useActionDetailedForm>

export const useActionDetailedForm = (
  action: MaybeRefOrGetter<DetailedAction | null> = null
) => {
  const actionRef = toRef(action)

  const linkDataSchema = z.object({
    type: z.literal('Link'),
    url: z.string().url()
  })

  const pythonDataSchema = z.object({
    type: z.literal('Python'),
    code: z.string().min(0).max(20000),
    useCombobox: z.boolean(),
    comboboxCode: z.string().min(0).max(20000).optional()
  })

  const javascriptDataSchema = z.object({
    type: z.literal('Javascript'),
    code: z.string().min(0).max(20000),
    useCombobox: z.boolean(),
    comboboxCode: z.string().min(0).max(20000).optional()
  })

  const windowsCMDDataSchema = z.object({
    type: z.literal('Windows CMD'),
    code: z.string().min(0).max(20000),
    useCombobox: z.boolean(),
    comboboxCode: z.string().min(0).max(20000).optional()
  })

  const dataSchema = {
    Link: linkDataSchema,
    Python: pythonDataSchema,
    Javascript: javascriptDataSchema,
    'Windows CMD': windowsCMDDataSchema
  }

  const actionSchema = computed(() =>
    toTypedSchema(
      z.object({
        name: z.string().min(2).max(25),
        description: z.string().max(175).optional(),
        isPublic: z.boolean().default(false),
        isActive: z.boolean().default(false),
        thumbnailKey: z.string().optional(),
        section: z.string().nullable().optional(),
        workspace: z.number().nullable().optional(),
        permissions: z
          .array(z.custom<User | DetailedGroup | DetailedRole>())
          .default([]),
        hasDelayBeforeRelaunch: z.boolean().default(false),
        delayBeforeRelaunch: z.number().min(0).default(2000),
        data: actionRef.value
          ? dataSchema[actionRef.value.data.type]
          : linkDataSchema
      })
    )
  )

  const getInitialValues = (newValue: DetailedAction | null) => {
    if (newValue) {
      return {
        name: newValue.name,
        description: newValue.description,
        isPublic: newValue.isPublic,
        isActive: newValue.isActive,
        data: newValue.data,
        section: newValue.section,
        workspace: newValue.workspace,
        permissions: [...newValue.users, ...newValue.groups, ...newValue.roles],
        hasDelayBeforeRelaunch: newValue.hasDelayBeforeRelaunch ?? false,
        delayBeforeRelaunch: newValue.delayBeforeRelaunch ?? 1000
      }
    }
  }

  const form = useForm({
    validationSchema: actionSchema,
    initialValues: getInitialValues(actionRef.value),
    keepValuesOnUnmount: true
  })

  watch(actionRef, newValue => {
    if (!newValue) return
    form.resetForm()
    form.setValues(getInitialValues(newValue) ?? {})
  })

  return form
}
