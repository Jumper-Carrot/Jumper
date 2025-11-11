<template>
  <div class="flex items-center gap-1 pr-2">
    <button
      class="group rounded-full p-[3px] transition-colors hover:bg-slate-200
        dark:hover:bg-slate-800"
      @click="() => (isThemingBarOpen = !isThemingBarOpen)"
      :title="isThemingBarOpen ? 'Close Theming Bar' : 'Open Theming Bar'"
    >
      <Palette
        class="h-[17px] w-[17px] text-slate-700 transition-colors group-hover:text-slate-900
          dark:text-slate-200 dark:group-hover:text-slate-100"
      />
    </button>
    <button
      class="group rounded-full p-[3px] transition-colors hover:bg-slate-200
        dark:hover:bg-slate-800"
      @click="openDebugWindow"
    >
      <Bug
        class="h-[17px] w-[17px] text-slate-700 transition-colors group-hover:text-slate-900
          dark:text-slate-200 dark:group-hover:text-slate-100"
      />
    </button>
    <component
      :is="router.currentRoute.value.name !== 'home' ? 'div' : 'RouterLink'"
      :to="{ name: 'settings' }"
      class="group rounded-full p-[3px] transition-colors"
      :class="{
        'hover:bg-slate-200 dark:hover:bg-slate-800': !isSettingDisabled(),
        'cursor-default': isSettingDisabled()
      }"
      title="Settings"
    >
      <Cog
        class="text-slate-700 transition-colors dark:text-slate-200"
        :class="{
          'group-hover:text-slate-900 dark:group-hover:text-slate-100':
            !isSettingDisabled(),
          'opacity-50': isSettingDisabled()
        }"
        :size="17"
      />
    </component>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Cog, Bug, Palette } from 'lucide-vue-next'

import { useDebugWindowStore, useTitleBarOptionsStore } from '@/stores'
import { storeToRefs } from 'pinia'

const router = useRouter()
const debugWindowStore = useDebugWindowStore()

const isSettingDisabled = () => router.currentRoute.value.name !== 'home'
const { isThemingBarOpen } = storeToRefs(useTitleBarOptionsStore())

const openDebugWindow = () => {
  if (debugWindowStore.isOpen) {
    debugWindowStore.focus()
  }

  debugWindowStore.open()
}
</script>
