<template>
  <DropdownMenu v-model:open="dropdownOpen">
    <DropdownMenuTrigger as-child>
      <Button
        class="flex h-[22px] w-[22px] items-center justify-center p-0
          text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        variant="ghost"
        title="Afficher/masquer options logs"
      >
        <Eye class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-[180px]">
      <div class="flex flex-col gap-1 py-1" @mousedown.stop>
        <div
          class="flex cursor-pointer items-center gap-2 rounded px-2 py-1
            transition-colors"
          @click.stop.prevent
        >
          <Checkbox
            v-model:checked="showStrOut"
            class="size-3.5 border-slate-400 data-[state=checked]:bg-slate-400
              dark:border-slate-800 dark:data-[state=checked]:bg-slate-800"
          />
          <span class="text-xs text-slate-500 italic">stdout</span>
        </div>
        <div
          class="flex cursor-pointer items-center gap-2 rounded px-2 py-1
            transition-colors"
          @click.stop.prevent
        >
          <Checkbox
            v-model:checked="showStrErr"
            class="size-3.5 border-slate-400 data-[state=checked]:bg-slate-400
              dark:border-slate-800 dark:data-[state=checked]:bg-slate-800"
          />
          <span class="text-xs text-slate-500 italic dark:text-slate-400"
            >stderr</span
          >
        </div>
        <div
          class="flex cursor-pointer items-center gap-2 rounded px-2 py-1
            transition-colors"
          @click.stop.prevent
        >
          <Checkbox
            v-model:checked="showLineInfo"
            class="size-3.5 border-slate-400 data-[state=checked]:bg-slate-400
              dark:border-slate-800 dark:data-[state=checked]:bg-slate-800"
          />
          <span class="text-xs text-slate-500 italic dark:text-slate-400"
            >show ligne info</span
          >
        </div>
        <div class="flex justify-end px-2 pt-2">
          <span class="text-xs text-slate-400">Total logs: {{ logCount }}</span>
        </div>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { useLogsStore } from '@/stores/logsStore'

import { Button } from '@@materials/ui/button'
import { Checkbox } from '@@materials/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent
} from '@@materials/ui/dropdown-menu'

const dropdownOpen = ref(false)

const showStrOut = defineModel<boolean>('showStrOut', { default: true })
const showStrErr = defineModel<boolean>('showStrErr', { default: true })
const showLineInfo = defineModel<boolean>('showLineInfo', { default: true })

const { logs } = storeToRefs(useLogsStore())
const logCount = computed(() => logs.value.length)
</script>
