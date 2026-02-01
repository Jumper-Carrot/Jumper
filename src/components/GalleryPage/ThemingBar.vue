<template>
  <div
    v-if="isThemingBarOpen"
    class="flex h-7 items-center justify-end gap-2 border-y bg-slate-50 px-2
      dark:border-slate-700 dark:bg-slate-900"
  >
    <div class="mr-auto flex items-center gap-4" v-if="authUserStore.user">
      <label
        v-if="systemInfo?.allowCustomOrder !== false"
        class="flex cursor-pointer items-center gap-0 text-xs select-none"
      >
        <Checkbox
          :checked="authUserStore.user.preferences.allowCustomOrder"
          @update:checked="onChangeAllowCustomOrder"
          class="mr-1 size-3.5"
        />
        Custom Order
      </label>
      <label
        v-if="systemInfo?.allowActionSections !== false"
        class="flex cursor-pointer items-center gap-0 text-xs select-none"
      >
        <Checkbox
          :checked="authUserStore.user.preferences.allowSections"
          @update:checked="onChangeAllowSections"
          class="mr-1 size-3.5"
        />
        Allow Sections
      </label>
    </div>
    <div class="flex h-full items-center gap-1">
      <button
        class="group rounded-full p-[3px] transition-colors hover:bg-slate-200
          dark:hover:bg-slate-800"
        :title="isDark ? 'Light Mode' : 'Dark Mode'"
        @click="() => toggleDark()"
      >
        <Sun
          v-if="isDark"
          class="h-[17px] w-[17px] text-slate-700 transition-colors
            group-hover:text-slate-900 dark:text-slate-200
            dark:group-hover:text-slate-100"
        />
        <Moon
          v-else
          class="h-[17px] w-[17px] text-slate-700 transition-colors
            group-hover:text-slate-900 dark:text-slate-200
            dark:group-hover:text-slate-100"
        />
      </button>
      <button
        class="group rounded-full p-[3px] transition-colors hover:bg-slate-200
          dark:hover:bg-slate-800"
      >
        <X
          class="h-[17px] w-[17px] text-slate-700 transition-colors
            group-hover:text-slate-900 dark:text-slate-200
            dark:group-hover:text-slate-100"
          @click="() => (isThemingBarOpen = false)"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Sun, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import {
  useTitleBarOptionsStore,
  useAuthUserStore,
  useSystemStore
} from '@/stores'

import Checkbox from '@@materials/ui/checkbox/Checkbox.vue'
import Moon from './Moon.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { isThemingBarOpen } = storeToRefs(useTitleBarOptionsStore())
const authUserStore = useAuthUserStore()
const { systemInfo } = storeToRefs(useSystemStore())

const onChangeAllowCustomOrder = (val: boolean) => {
  authUserStore.updateUserPreferences({ allowCustomOrder: val })
}
const onChangeAllowSections = (val: boolean) => {
  authUserStore.updateUserPreferences({ allowSections: val })
}
</script>
