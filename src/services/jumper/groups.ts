import type { DetailedGroup, Page } from '@@types'
import { jumperClient, JumperBackendError } from '@/services/jumper/client'

export const getDetailedGroups = async (params: {
  page?: number
  limit?: number
  search?: string
  ordering?: string
}) => {
  const { page = 1, limit = 25, search, ordering } = params
  const response = await jumperClient.get<Page<DetailedGroup>>('/v1/groups', {
    params: { page, limit, search, ordering, detailed: true }
  })
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}