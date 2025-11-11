import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTitleBarOptionsStore = defineStore('titleBarOptions', () => {
  const search = ref('')
  const isThemingBarOpen = ref(false)
  return { search, isThemingBarOpen }
})
