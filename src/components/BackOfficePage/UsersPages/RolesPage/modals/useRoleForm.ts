import type { DetailedRole, Group, Action, ShortUser } from '@@types'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

// import { checkUniqueName } from '@/services/form-checks/roleFormChecks'

export const useRoleForm = (
  role?: DetailedRole
): ReturnType<typeof useForm> => {
  const roleSchema = toTypedSchema(
    z.object({
      name: z.string().min(2).max(40),
      // .refine(async (username) => await checkUniqueUsername(role, username), {
      //   message: 'This username is already taken'
      // }),
      description: z.string().optional(),
      users: z.array(z.custom<ShortUser>()).default([]),
      groups: z.array(z.custom<Group>()).default([]),
      actions: z.array(z.custom<Action>()).default([])
    })
  )
  return useForm({
    validationSchema: roleSchema,
    initialValues: {
      name: role?.name || '',
      description: role?.description || '',
      users: role?.users || [],
      groups: role?.groups || [],
      actions: role?.actions || []
    }
  })
}
