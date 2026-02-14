import type { DetailedGroup, DetailedRole, ShortUser, User } from './user'

import { Workspace } from './workspace'

export const ACTION_TYPES = [
  'Link',
  'Windows CMD',
  'Python',
  'Javascript'
] as const

export type Action = {
  id: number
  name: string
  description: string
  isActive: boolean
  isPublic: boolean
  creationDate: string
  lastUpdate: string
  thumbnailUrl: string
  section: string | null
  hasDelayBeforeRelaunch: boolean
  delayBeforeRelaunch: number
  data: {
    type: ActionData['type']
  }
}

export type PlayableAction = Action & {
  data: ActionData
}

export type DetailedAction = Action & {
  data: ActionData
  createBy: ShortUser
  users: ShortUser[]
  user_ids?: ShortUser['id'][]
  groups: DetailedGroup[]
  group_ids?: DetailedGroup['id'][]
  roles: DetailedRole[]
  workspace: Workspace['id'] | null
  role_ids?: DetailedRole['id'][]
  thumbnailKey?: string
}

export type Permissions = {
  users: User[]
  groups: DetailedGroup[]
  roles: DetailedRole[]
}

export type ActionData =
  | PythonActionData
  | LinkActionData
  | WindowsCMDActionData
  | JavascriptActionData
export type ActionVersion = DetailedAction & {
  history: {
    id: number
    date: string
    number: number
    user: ShortUser
  }
}

export type LinkActionData = {
  type: 'Link'
  url: string
}

export type PythonActionData = {
  type: 'Python'
  code: string
  useCombobox: boolean
  comboboxCode: string
}

export type JavascriptActionData = {
  type: 'Javascript'
  code: string
  useCombobox: boolean
  comboboxCode: string
}

export type WindowsCMDActionData = {
  type: 'Windows CMD'
  code: string
  useCombobox: boolean
  comboboxCode: string
}
