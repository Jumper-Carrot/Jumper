import type { User } from '@@types'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { passwordSchema } from '@/composables/usePasswordUserForm'
import {
  checkUniqueEmail,
  checkUniqueUsername
} from '@/services/form-checks/userFormChecks'

export const useUserForm = (user?: User): ReturnType<typeof useForm> => {
  const userSchema = toTypedSchema(
    z.object({
      username: z
        .string()
        .min(4)
        .max(40)
        .refine(async (username) => await checkUniqueUsername(user, username), {
          message: 'This username is already taken'
        }),
      email: z
        .string()
        .email()
        .refine(async (email) => await checkUniqueEmail(user, email), {
          message: 'This email is already taken'
        }),
      password: user
        ? passwordSchema.optional().or(z.literal(''))
        : passwordSchema,
      firstName: z.string().min(2).max(20).optional().or(z.literal('')),
      lastName: z.string().min(2).max(20).optional().or(z.literal('')),
      systemRole: z
        .enum(['user', 'action_manager', 'user_manager', 'admin'])
        .default('user'),
      isActive: user ? z.boolean() : z.boolean().default(true)
    })
  )
  return useForm({
    validationSchema: userSchema,
    initialValues: user
  })
}
