import type {
  DetailedUser,
  Group,
  Page,
  ShortUser,
  User,
  UserPreferences
} from '@@types'

import { JumperBackendError, jumperClient } from '@/services/jumper/client'

export const getAuthUser = async () => {
  const response = await jumperClient.get<DetailedUser>('/v1/users/me')
  if (response.status !== 200) {
    console.error('Failed to fetch auth user', response)
    return null
  }
  return response.data
}

type UserQueryParams = {
  page?: number
  limit?: number
  active?: boolean
  search?: string
  ordering?: string
  groups?: Group['id']
}
export async function getUsers(
  params: UserQueryParams & { short: true }
): Promise<Page<ShortUser>>
export async function getUsers(
  params: UserQueryParams & { short?: false }
): Promise<Page<User>>
export async function getUsers(
  params: UserQueryParams & { short?: boolean } = {}
): Promise<Page<User> | Page<ShortUser>> {
  const { page = 1, limit = 25, active, search, ordering, groups } = params
  const response = await jumperClient.get<Page<User>>('/v1/users', {
    params: { page, limit, is_active: active, search, ordering, groups }
  })
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const create = async (user: Partial<User>) => {
  const response = await jumperClient.post<User>('/v1/users', user)
  if (response.status !== 201) throw new JumperBackendError(response)
  return response.data
}

export const update = async (userId: User['id'], user: Partial<User>) => {
  const response = await jumperClient.patch<User>(`/v1/users/${userId}`, user)
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const updateProfilePicture = async (id: User['id'], data: File) => {
  const formData = new FormData()
  formData.append('profile_picture', data)
  const response = await jumperClient.put<{
    profilePictureUrl: User['profilePictureUrl']
  }>(`/v1/users/${id}/profile`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const remove = async (userId: User['id']) => {
  const response = await jumperClient.delete(`/v1/users/${userId}`)
  if (response.status !== 204) throw new JumperBackendError(response)
}

export const getGroups = async () => {
  const response = await jumperClient.get<Group[]>('/v1/groups')
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

/**
 * Check if an user with the same username exist
 * @param username The name of the user to check existence.
 * @returns True if an user with the same name exist, else False
 */
export const isUserWithUsernameExist = async (
  username: string
): Promise<Boolean> =>
  (await jumperClient.get(`/v1/users/exists?username=${username}`)).data

/**
 * Check if an user with the same email exist
 * @param email The email of the user to check existence.
 * @returns True if an user with the same email exist, else False
 */
export const isUserWithEmailExist = async (email: string): Promise<Boolean> =>
  (await jumperClient.get(`/v1/users/exists?email=${email}`)).data

/**
 * Check if the user is the last admin.
 * @param userId The id of the user.
 * @returns True if the user is the last admin, else False.
 */
export const isLastAdmin = async (userId: User['id']): Promise<boolean> => {
  const response = await jumperClient.get(`/v1/users/${userId}/is-last-admin`)
  if (response.status !== 200) {
    throw new Error('Failed to check if user is last admin')
  }
  return response.data
}

export const updateUserPreferences = async (
  preferenceId: UserPreferences['id'],
  preferences: Partial<UserPreferences>
) => {
  const response = await jumperClient.patch<UserPreferences>(
    `/v1/user-preferences/${preferenceId}`,
    preferences
  )
  if (response.status !== 200) throw new JumperBackendError(response)
  return response.data
}

export const updateUserPreferenceBackgroundImage = async (
  preferenceId: UserPreferences['id'],
  file: File
) => {
  const formData = new FormData()
  formData.append('custom_background_image', file)
  const response = await jumperClient.put<{
    customBackgroundImageUrl: string | null
  }>(`/v1/user-preferences/${preferenceId}/background-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (response.status !== 200)
    throw new Error('Failed to update user preference background image')
  return response.data
}

export const deleteUserPreferenceBackgroundImage = async (
  preferenceId: UserPreferences['id']
) => {
  const response = await jumperClient.delete<{
    customBackgroundImageUrl: string | null
  }>(`/v1/user-preferences/${preferenceId}/background-image`)
  if (response.status !== 204)
    throw new Error('Failed to delete user preference background image')
  return response.data
}
