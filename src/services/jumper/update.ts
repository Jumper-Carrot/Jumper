import { VersionInfo } from '@@types'

import jumper from '@/services/jumper'
import { jumperClient, JumperBackendError } from '@/services/jumper/client'

export const getLastVersionInfo = async (): Promise<VersionInfo | null> => {
  await jumper.client.setBackendUrl()
  if (jumperClient.defaults.baseURL === undefined) return null
  try {
    const response = await jumperClient.get('/v1/frontend-update')
    return response.data
  } catch (error) {
    if (error instanceof JumperBackendError) {
      throw new Error(`Failed to fetch latest version info: ${error.message}`)
    }
    throw error
  }
}
