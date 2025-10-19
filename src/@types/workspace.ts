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
  users: User[]
  user_ids?: User['id'][]
  groups: DetailedGroup[]
  group_ids?: DetailedGroup['id'][]
  roles: DetailedRole[]
  role_ids?: DetailedRole['id'][]
}


