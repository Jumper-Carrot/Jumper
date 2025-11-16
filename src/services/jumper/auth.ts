import { jumperClient } from '@/services/jumper/client'
import { load } from '@tauri-apps/plugin-store'

const LOGIN_PAGE_PATH: string = '/login'

export const login = async (email: string, password: string) => {
  const response = await jumperClient.post('/v1/auth', {
    email,
    password
  })
  if (response.status !== 200) {
    console.error('Failed to login', response)
    return { error: 'Failed to login' }
  }

  await setTokens(response.data.access, response.data.refresh)
  return { error: null }
}

export const setTokens = async (access: string, refresh: string) => {
  await setAccessToken(access)
  await setRefreshToken(refresh)
}

export const logout = async () => {
  await jumperClient.post('/v1/auth/logout', {
    refresh: await getRefreshToken()
  })
  clearTokens()
}

// --- Storage helpers ---
const store = await load('jumper_tokens.json', { autoSave: true, defaults: {} })

export const getAccessToken = async () => await store.get<string>('access')
export const getRefreshToken = async () => await store.get<string>('refresh')

export const setAccessToken = async (token: string) => {
  await store.set('access', token)
  await store.save()
}

export const setRefreshToken = async (token: string) => {
  await store.set('refresh', token)
  await store.save()
}

export const clearTokens = async () => {
  await store.delete('access')
  await store.delete('refresh')
  await store.save()
}

// --- Interceptors ---
jumperClient.interceptors.request.use(async (config) => {
  // Add Authorization header if token exists
  const token = await getAccessToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

jumperClient.interceptors.response.use(async (response) => {
  // Manage token refresh queue to avoid multiple refresh calls
  if (response.status !== 401) {
    return response
  }
  const originalRequest = response.config
  if (originalRequest._retry) return Promise.reject(response)
  originalRequest._retry = true

  // Queue management
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
      .then(() => jumperClient(originalRequest))
      .catch((err) => Promise.reject(err))
  }

  isRefreshing = true

  try {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token available')

    const refreshResponse = await jumperClient.post('/v1/auth/refresh', {
      refresh: refreshToken
    })
    
    if (refreshResponse.status !== 200)
      throw new Error('Failed to refresh token')

    await setAccessToken(refreshResponse.data.access)
    // await setRefreshToken(refreshResponse.data.refresh)
    processQueue(null)

    return jumperClient(originalRequest)
  } catch (err) {
    processQueue(err)
    await clearTokens()
    if (window.location.pathname !== LOGIN_PAGE_PATH) {
      window.location.href = LOGIN_PAGE_PATH
    }
    return Promise.reject(err)
  } finally {
    isRefreshing = false
  }
})

let isRefreshing = false
let failedQueue: { resolve: Function; reject: Function }[] = []

function processQueue(error: any) {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve()
  })
  failedQueue = []
}
