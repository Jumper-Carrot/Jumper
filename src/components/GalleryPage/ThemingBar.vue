<template>
  <div
    v-if="isThemingBarOpen"
    class="flex h-[28px] items-center justify-end gap-2 border-y bg-slate-50 px-2 dark:border-slate-700 dark:bg-slate-900"
  >
    <div class="flex h-full items-center">
      <button
        class="group rounded-full p-[3px] transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
        :title="isDark ? 'Light Mode' : 'Dark Mode'"
        @click="() => toggleDark()"
      >
        <Sun
          v-if="isDark"
          class="h-[17px] w-[17px] text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-slate-100"
        />
        <Moon
          v-else
          class="h-[17px] w-[17px] text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-slate-100"
        />
      </button>
      <button
        class="group ml-2 rounded-full p-[3px] transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        <Save
          class="h-[17px] w-[17px] text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-slate-100"
          @click="() => (isThemingBarOpen = false)"
        />
      </button>
      <button
        class="group rounded-full p-[3px] transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        <X
          class="h-[17px] w-[17px] text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-slate-100"
          @click="() => (isThemingBarOpen = false)"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTitleBarOptionsStore } from '@/stores'
import { useDark, useToggle } from '@vueuse/core'
import { Save, Sun, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import Moon from './Moon.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { isThemingBarOpen } = storeToRefs(useTitleBarOptionsStore())
</script>
