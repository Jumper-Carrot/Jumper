<template>
  <button
    class="dark:hover:bg-opacity-60 flex h-[60px] w-full flex-col rounded-md
      border p-[6px] shadow-2xs transition-all dark:bg-slate-800
      dark:hover:bg-slate-700"
    :class="{
      [`border-slate-300 bg-white hover:bg-slate-50 hover:shadow-xs
      dark:border-slate-600`]: !isSelected,
      'ring-primary bg-slate-50 ring-2 dark:bg-slate-700': isSelected
    }"
  >
    <div class="flex items-center gap-1">
      <div
        class="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100
          p-[2px] shadow-xs dark:bg-slate-900"
      >
        <Link v-if="action.data.type == 'Link'" :size="12" />
        <img
          v-else-if="action.data.type == 'Python'"
          src="/actions/python.png"
        />
        <img
          v-else-if="action.data.type == 'Javascript'"
          src="/actions/javascript.png"
        />
        <img v-else src="/actions/windows-cmd.png" />
      </div>
      <h3
        class="truncate text-sm font-medium text-slate-800 dark:text-slate-300"
      >
        {{ action.name }}
      </h3>
      <div
        class="mb-2 ml-auto flex h-2 w-2 shrink-0 items-center justify-center
          rounded-md"
        :title="action.isActive ? 'Active' : 'Inactive'"
        :class="{
          'bg-green-400': action.isActive,
          'bg-slate-300': !action.isActive
        }"
      />
    </div>
    <p
      v-if="action.description"
      class="line-clamp-2 truncate text-start text-xs text-slate-500 italic
        dark:text-slate-400"
    >
      {{ action.description }}
    </p>
  </button>
</template>

<script setup lang="ts">
import type { Action } from '@@types'

import { Link } from 'lucide-vue-next'

defineProps<{
  action: Action
  isSelected: boolean
}>()
</script>
