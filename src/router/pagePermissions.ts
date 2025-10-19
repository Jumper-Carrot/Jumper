import type { RouteLocationNormalized } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthUserStore, useAuthConfigStore } from '@/stores'

type pagePermission = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => boolean

export const usePagePermissions = async (): Promise<{
  [key: string]: pagePermission
}> => {
  const authUserStore = useAuthUserStore()
  const { isAuthenticated, isAdmin, isFetching, isUserManager, isActionManager } =
    storeToRefs(useAuthUserStore())
  const { isScimEnabled } = storeToRefs(useAuthConfigStore())
  if (isFetching.value) {
    await authUserStore.refetch()
  }
  return {
    login: () => true,
    account: () => isAuthenticated.value,
    appearance: () => isAuthenticated.value,
    info: () => isAuthenticated.value,
    home: () => isAuthenticated.value,
    settings: () => isAuthenticated.value,
    actions: () => isAdmin.value || isActionManager.value,
    users: () => isAdmin.value || isUserManager.value || authUserStore.isActionManager,
    roles: () => isAdmin.value || isUserManager.value || authUserStore.isActionManager,
    system: () => isAdmin.value,
    groups: () => (isAdmin.value || isUserManager.value || authUserStore.isActionManager) && isScimEnabled.value
  }
}
