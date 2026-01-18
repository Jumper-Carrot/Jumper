<template>
  <div
    ref="logsContainer"
    @scroll="handleScroll"
    class="grow overflow-auto bg-slate-200 shadow-inner dark:bg-slate-800 log-scrollbar"
  >
    <div
      v-for="(log, i) in showedLogs"
      :key="log.timestamp"
      class="whitespace-pre-wrap px-2 font-mono"
      :class="{
        'text-slate-800 dark:text-slate-300':
          log.level !== 'error' && log.level !== 'warn',
        'bg-slate-300/50 bg-opacity-60 dark:bg-slate-700 dark:bg-opacity-30':
          i % 2 === 0 && log.level !== 'error' && log.level !== 'warn',
        'bg-red-100 font-semibold text-red-500 dark:bg-slate-800':
          log.level === 'error',
        'bg-orange-100 font-semibold text-orange-500 dark:bg-slate-800':
          log.level === 'warn'
      }"
    >
      {{ log.level.toLocaleUpperCase() }} - {{ log.timestamp }} [{{
        log.namespace
      }}
      - {{ log.execId.slice(0, 6) }}]: {{ log.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Log } from '@/stores/logsStore'

import { ref } from 'vue'

import { useScrollToBottom } from './useScrollToBottom'

const props = defineProps<{
  showedLogs: Log[]
}>()

const logsContainer = ref<HTMLDivElement | null>(null)

const { handleScroll } = useScrollToBottom(
  logsContainer,
  () => props.showedLogs.length
)
</script>

<style scoped>
.log-scrollbar::-webkit-scrollbar {
  -webkit-appearance: none;
}

.log-scrollbar::-webkit-scrollbar:vertical {
  width: 12px;
}

.log-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 0;
}

.log-scrollbar::-webkit-scrollbar-track {
  border-radius: 0;
}
</style>
