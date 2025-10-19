import type { SystemInfo } from '@@types'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const useSystemForm = (
  systemInfo?: SystemInfo
): ReturnType<typeof useForm> => {
  const systemSchema = toTypedSchema(
    z.object({
      allowActionWorkspaces: z.boolean()
    })
  )
  return useForm({
    validationSchema: systemSchema,
    initialValues: systemInfo
  })
}
