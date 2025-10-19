import { type Ref, computed } from 'vue'
import type { DetailedUser } from '@@types'

export const usePermissions = (user: Ref<DetailedUser | undefined | null>) => {
  const isAuthenticated = (
    user: DetailedUser | undefined | null
  ): user is DetailedUser => user !== undefined && user !== null

  const isAdmin = computed(
    () =>
      isAuthenticated(user.value) &&
      (user.value.systemRole === 'admin' || user.value.isSuperuserGroupMember)
  )

  const isUserManager = computed(
    () =>
      isAuthenticated(user.value) &&
      user.value.systemRole === 'user_manager'
  )

  const isActionManager = computed(
    () =>
      isAuthenticated(user.value) &&
      user.value.systemRole === 'action_manager'
  )

  return {
    isAuthenticated: computed(() => isAuthenticated(user.value)),
    isAdmin,
    isUserManager,
    isActionManager
  }
}
