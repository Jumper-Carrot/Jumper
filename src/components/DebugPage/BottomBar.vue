<template>
  <div
    class="flex h-[22px] w-full items-center bg-slate-300 px-2 dark:bg-slate-900 shrink-0"
  >
    <div class="flex items-center gap-1">
      <MiniSwitch
        class="dark:data-[state=checked]:bg-blue-300 data-[state=checked]:bg-blue-400"
        v-model="showOptionsExec"
      />
      <p class="text-xs italic text-slate-500 mb-0.5">Get Options</p>
    </div>
    <div class="flex items-center justify-center gap-1 h-full ml-6">
      <Checkbox
        v-model:checked="showStrOut"
        class="dark:data-[state=checked]:bg-slate-800 data-[state=checked]:bg-slate-400 dark:border-slate-800 border-slate-400 size-3.5"
      />
      <p class="text-xs italic text-slate-500 mb-0.5">stdout</p>
    </div>
    <div class="flex items-center justify-center gap-1 h-full ml-3">
      <Checkbox
        v-model:checked="showStrErr"
        class="dark:data-[state=checked]:bg-slate-800 data-[state=checked]:bg-slate-400 dark:border-slate-800 border-slate-400 size-3.5"
      />
      <p class="text-xs italic dark:text-slate-400 text-slate-500 mb-0.5">
        stderr
      </p>
    </div>

    <Button
      class="ml-auto flex h-[18px] w-[18px] items-center justify-center p-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      variant="ghost"
      title="Clear logs"
      :disabled="showedLogs.length === 0"
      @click="executionsStore.clear()"
    >
      <Ban />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Ban } from 'lucide-vue-next'

import { useExecutionsStore } from '@/stores'
import { type Log } from '@/stores/logsStore'

import { Button } from '@@materials/ui/button'
import { Checkbox } from '@@materials/ui/checkbox'
import { MiniSwitch } from '@@materials/ui/switch'

const executionsStore = useExecutionsStore()

defineProps<{
  showedLogs: Log[]
}>()

const showOptionsExec = defineModel<boolean>('showOptionsExec', {
  default: false
})
const showStrOut = defineModel<boolean>('showStrOut', {
  default: true
})
const showStrErr = defineModel<boolean>('showStrErr', {
  default: true
})
</script>
