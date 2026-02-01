import type { SystemInfo } from '@@types'

import { computed } from 'vue'
import { defineStore } from 'pinia'

import jumper from '@/services/jumper'
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

  const updateDefaultBackgroundImage = async (file: File) => {
    const newData = await jumper.system.updateDefaultBackgroundImage(file)
    query.setData(oldData => ({
      ...oldData,
      defaultBackgroundImageUrl: newData.defaultBackgroundImageUrl
    }))
  }
  const deleteDefaultBackgroundImage = async () => {
    await jumper.system.deleteDefaultBackgroundImage()
    query.setData(oldData => ({
      ...oldData,
      defaultBackgroundImageUrl: null
    }))
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
    updateSystemInfo,
    updateDefaultBackgroundImage,
    deleteDefaultBackgroundImage
  }
})
