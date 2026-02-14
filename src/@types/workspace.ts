import type { ShortUser, User, DetailedRole, DetailedGroup } from './user'

export type Workspace = {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export type DetailedWorkspace = Workspace & {
  id: number
  createdBy: ShortUser
  usersManagers: User[]
  usersManagersIds?: User['id'][]
  groupsManagers: DetailedGroup[]
  groupsManagersIds?: DetailedGroup['id'][]
  rolesManagers: DetailedRole[]
  rolesManagersIds?: DetailedRole['id'][]
  actionsAllowedUsers: User[]
  actionsAllowedUsersIds?: User['id'][]
  actionsAllowedGroups: DetailedGroup[]
  actionsAllowedGroupsIds?: DetailedGroup['id'][]
  actionsAllowedRoles: DetailedRole[]
  actionsAllowedRolesIds?: DetailedRole['id'][]
}
