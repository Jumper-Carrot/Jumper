<template>
  <div
    class="flex h-[22px] w-full shrink-0 items-center bg-slate-300 px-2
      dark:bg-slate-900"
  >
    <div class="flex shrink-0 items-center gap-1">
      <MiniSwitch
        class="data-[state=checked]:bg-blue-400
          dark:data-[state=checked]:bg-blue-300"
        v-model="showOptionsExec"
      />
      <p class="mb-0.5 text-xs text-slate-500 italic">Get Options</p>
    </div>
    <div class="ml-auto flex items-center">
      <Input
        v-model="search"
        class="mx-2 h-4 min-w-0 shrink rounded-sm bg-slate-200 px-2 text-xs
          ring-0 dark:bg-slate-800"
        placeholder="Search logs..."
      />
    </div>
    <div class="mr-0.5 flex items-center">
      <LogOptionsMenu
        v-model:showStrOut="showStrOut"
        v-model:showStrErr="showStrErr"
        v-model:showLineInfo="showLineInfo"
      />
    </div>
    <Button
      class="flex h-[18px] w-[18px] items-center justify-center p-2.5
        text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
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
import Input from '@@materials/ui/input/Input.vue'
import { MiniSwitch } from '@@materials/ui/switch'
import LogOptionsMenu from './LogOptionsMenu.vue'

const executionsStore = useExecutionsStore()

defineProps<{
  showedLogs: Log[]
}>()

const search = defineModel<string>('search', {
  default: ''
})

const showOptionsExec = defineModel<boolean>('showOptionsExec', {
  default: false
})
const showStrOut = defineModel<boolean>('showStrOut', {
  default: true
})
const showStrErr = defineModel<boolean>('showStrErr', {
  default: true
})

const showLineInfo = defineModel<boolean>('showLineInfo', {
  default: true
})
</script>
