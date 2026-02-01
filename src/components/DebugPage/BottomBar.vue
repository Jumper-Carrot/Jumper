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
    <div
      class="ml-6 flex h-full items-center justify-center gap-1 max-sm:hidden"
    >
      <Checkbox
        v-model:checked="showStrOut"
        class="size-3.5 border-slate-400 data-[state=checked]:bg-slate-400
          dark:border-slate-800 dark:data-[state=checked]:bg-slate-800"
      />
      <p class="mb-0.5 text-xs text-slate-500 italic">stdout</p>
    </div>
    <div
      class="ml-3 flex h-full items-center justify-center gap-1 max-sm:hidden"
    >
      <Checkbox
        v-model:checked="showStrErr"
        class="size-3.5 border-slate-400 data-[state=checked]:bg-slate-400
          dark:border-slate-800 dark:data-[state=checked]:bg-slate-800"
      />
      <p class="mb-0.5 text-xs text-slate-500 italic dark:text-slate-400">
        stderr
      </p>
    </div>
    <div
      class="ml-3 flex h-full items-center justify-center gap-1 max-sm:hidden"
    >
      <Checkbox
        v-model:checked="showLineInfo"
        class="size-3.5 border-slate-400 data-[state=checked]:bg-slate-400
          dark:border-slate-800 dark:data-[state=checked]:bg-slate-800"
      />
      <p class="mb-0.5 text-xs text-slate-500 italic dark:text-slate-400">
        show ligne info
      </p>
    </div>
    <div class="ml-auto flex items-center">
      <Input
        v-model="search"
        class="mx-2 h-4 min-w-0 shrink rounded-sm bg-slate-200 px-2 text-xs
          ring-0 dark:bg-slate-800"
        placeholder="Search logs..."
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
import { Checkbox } from '@@materials/ui/checkbox'
import Input from '@@materials/ui/input/Input.vue'
import { MiniSwitch } from '@@materials/ui/switch'

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
