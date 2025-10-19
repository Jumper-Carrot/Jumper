import type { Workspace, DetailedWorkspace, Page } from '@@types'
import { jumperClient, JumperBackendError } from '@/services/jumper/client'

type WorkspacesQueryParams = {
  is_active?: boolean
  page?: number
  limit?: number
  ordering?: string
  detail?: boolean
  search?: string
}

export async function listWorkspaces(
  params: WorkspacesQueryParams & { detail: true }
): Promise<Page<DetailedWorkspace>>
export async function listWorkspaces(
  params?: WorkspacesQueryParams & { detail?: false }
): Promise<Page<Workspace>>
export async function listWorkspaces(params?: WorkspacesQueryParams) {
  const response = await jumperClient.get<Page<Workspace | DetailedWorkspace>>(
    '/v1/workspaces',
    {
      params
    }
  )
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const create = async (workspace: Partial<DetailedWorkspace>) => {
  const response = await jumperClient.post<DetailedWorkspace>(
    '/v1/workspaces',
    workspace,
    {
      params: { detail: true }
    }
  )
  if (response.status !== 201) throw new JumperBackendError(response)
  return response.data
}

export const update = async (
  workspaceId: Workspace['id'],
  workspace: Partial<DetailedWorkspace>
) => {
  const response = await jumperClient.patch<DetailedWorkspace>(
    `/v1/workspaces/${workspaceId}`,
    workspace,
    {
      params: { detail: true }
    }
  )
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const remove = async (workspaceId: Workspace['id']) => {
  const response = await jumperClient.delete(`/v1/workspaces/${workspaceId}`)
  if (response.status !== 204) throw new JumperBackendError(response)
}
