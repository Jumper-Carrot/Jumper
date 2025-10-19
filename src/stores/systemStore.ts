import type { SystemInfo } from '@@types'
import { computed } from 'vue'
import jumper from '@/services/jumper'
import { defineStore } from 'pinia'
import { useQuery } from '@/composables/query/useQuery'

export const useSystemStore = defineStore('system', () => {
  const query = useQuery(['system'], jumper.system.getSystemInfo)

  const systemInfo = query.data
  const isFetching = query.isFetching
  const errorMessage = query.errorMessage
  const refetch = query.refetch

  const updateSystemInfo = async (data: Partial<SystemInfo>) => {
    const newData = await jumper.system.updateSystemInfo(data)
    query.setData(() => newData)
  }

  const isWorkspacesAllowed = computed(
    () => systemInfo.value?.allowActionWorkspaces ?? false
  )

  return {
    systemInfo,
    isFetching,
    errorMessage,
    isWorkspacesAllowed,
    refetch,
    updateSystemInfo
  }
})
