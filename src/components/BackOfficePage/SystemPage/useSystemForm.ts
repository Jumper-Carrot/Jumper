import type { SystemInfo } from '@@types'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

export const useSystemForm = (
  systemInfo?: SystemInfo
): ReturnType<typeof useForm> => {
  const systemSchema = toTypedSchema(
    z.object({
      allowActionWorkspaces: z.boolean(),
      allowShowingDescription: z.boolean(),
      allowBackgroundImage: z.boolean(),
      allowUserCustomBackgroundImage: z.boolean(),
      allowActionSections: z.boolean(),
      allowUsersToHideActions: z.boolean(),
      allowCustomOrder: z.boolean()
    })
  )
  return useForm({
    validationSchema: systemSchema,
    initialValues: systemInfo
  })
}
