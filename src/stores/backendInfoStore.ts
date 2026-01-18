import type { BackendInfo } from '@@types'

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import jumper from '@/services/jumper'
import { jumperClient } from '@/services/jumper/client'

export const useBackendInfoStore = defineStore('backendInfo', () => {
  const backendInfo = ref<BackendInfo | null>(null)

  const isBackendSetup = computed(() => {
    return backendInfo.value !== null
  })

  const setBackendInfo = async () => {
    backendInfo.value = (await jumper.client.setBackendUrl()) ?? null
  }

  const getBackendHost = () => {
    return jumperClient.defaults.baseURL || ''
  }

  const isScimEnabled = computed(() => backendInfo.value?.scimEnabled ?? false)
  const isOidcEnabled = computed(() =>
    backendInfo.value?.providers?.some(provider => provider.id === 'oidc')
  )
  const isEmailEnabled = computed(() =>
    backendInfo.value?.providers?.some(provider => provider.id === 'email')
  )
  const ssoDiplayName = computed(
    () =>
      backendInfo.value?.providers.find(provider => provider.id === 'oidc')
        ?.name ?? 'SSO'
  )
  const oidcRedirectUrl = computed(() => {
    const authUrl =
      backendInfo.value?.providers.find(provider => provider.id === 'oidc')
        ?.authUrl ?? ''
    return authUrl
      ? `${jumper.client.jumperClient.defaults.baseURL}/v1${authUrl}?client=jumper`
      : null
  })
  const isSSOEnabled = computed(
    () => isOidcEnabled.value || isScimEnabled.value
  )

  return {
    backendInfo,
    isBackendSetup,
    setBackendInfo,
    getBackendHost,
    isScimEnabled,
    isSSOEnabled,
    isOidcEnabled,
    isEmailEnabled,
    ssoDiplayName,
    oidcRedirectUrl
  }
})
