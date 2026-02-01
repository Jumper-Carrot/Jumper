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

export const updateDefaultBackgroundImage = async (file: File) => {
  const formData = new FormData()
  formData.append('default_background_image', file)
  const response = await jumperClient.put<{
    defaultBackgroundImageUrl: string | null
  }>(`/v1/system-info/default-background`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.status !== 200)
    throw new Error('Failed to update default background image')
  return response.data
}

export const deleteDefaultBackgroundImage = async () => {
  const response = await jumperClient.delete<{
    defaultBackgroundImageUrl: string | null
  }>(`/v1/system-info/default-background`)
  if (response.status !== 204)
    throw new Error('Failed to delete default background image')
  return response.data
}
