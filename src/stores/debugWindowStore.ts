import { ref } from 'vue'
import { getAllWindows, type Window } from '@tauri-apps/api/window'
import { defineStore } from 'pinia'

export const useDebugWindowStore = defineStore('debugWindow', () => {
  const isOpen = ref(false)
  const debugWindow = ref<Window | null>(null)

  const open = async () => {
    await refreshWindows()
    if (!debugWindow.value) return
    debugWindow.value.show()
    isOpen.value = true
  }

  const refreshWindows = async () => {
    const windows = await getAllWindows()
    debugWindow.value = windows.find(window => window.label === 'debug') ?? null
  }

  const focus = async () => {
    if (!debugWindow.value) return
    const isMinimized = await debugWindow.value.isMinimized()
    if (isMinimized) {
      debugWindow.value.unminimize()
    }
    debugWindow.value.setFocus()
  }

  const close = () => {
    if (!debugWindow.value) return
    debugWindow.value.hide()
    isOpen.value = false
  }

  refreshWindows()

  return {
    isOpen,
    open,
    close,
    focus
  }
})
