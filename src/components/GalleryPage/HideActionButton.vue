<template>
  <button
    class="absolute top-0 right-0 z-10 rounded-full bg-slate-300 p-1 opacity-80
      transition-colors hover:bg-slate-400 hover:opacity-100 dark:bg-slate-700
      dark:hover:bg-slate-600"
    title="Hide Action"
    @click="toggleHidden"
  >
    <EyeOff class="h-4 w-4" v-if="isHidden" />
    <Eye class="h-4 w-4" v-else />
  </button>
</template>

<script setup lang="ts">
import type { Action, UserPreferences } from '@@types'

import { computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

import { useAuthUserStore } from '@/stores'

const authUserStore = useAuthUserStore()

const props = defineProps<{
  actionId: Action['id']
  userPreferences: UserPreferences
}>()

const isHidden = computed(() =>
  props.userPreferences.hiddenActions.includes(props.actionId)
)

const toggleHidden = () => {
  const hiddenActions = new Set(props.userPreferences.hiddenActions)
  if (isHidden.value) {
    hiddenActions.delete(props.actionId)
  } else {
    hiddenActions.add(props.actionId)
  }
  authUserStore.updateUserPreferences({
    hiddenActions: Array.from(hiddenActions)
  })
}
</script>
