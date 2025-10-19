import type { SystemInfo } from '@@types'
import { jumperClient } from './client'

export const getSystemInfo = async () => {
  const response = await jumperClient.get<SystemInfo>('/v1/system-info')
  if (response.status !== 200) {
    throw new Error('Failed to update user')
  }
  return response.data
}

export const updateSystemInfo = async (data: Partial<SystemInfo>) => {
  const response = await jumperClient.patch<SystemInfo>('/v1/system-info', data)
  if (response.status !== 200) {
    throw new Error('Failed to update system info')
  }
  return response.data
}
