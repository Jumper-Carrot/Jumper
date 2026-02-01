<template>
  <div
    ref="logsContainer"
    @scroll="handleScroll"
    class="log-scrollbar grow overflow-auto bg-slate-200 shadow-inner
      dark:bg-slate-800"
  >
    <div
      v-for="(log, i) in showedLogs"
      :key="log.timestamp"
      class="px-2 font-mono whitespace-pre-wrap"
      :class="{
        'text-slate-800 dark:text-slate-300':
          log.level !== 'error' && log.level !== 'warn',
        'bg-slate-300/50 dark:bg-slate-700/40':
          i % 2 === 0 && log.level !== 'error' && log.level !== 'warn',
        [`bg-red-100 font-semibold text-red-500/70 dark:bg-slate-800
        dark:text-red-400/80`]: log.level === 'error'
      }"
    >
      <template v-if="showLineInfo"
        >{{ log.timestamp }} [{{ log.namespace }}]
        <span> {{ log.option ? ` | ${log.option}` : '' }} </span> -
        {{ log.execId.slice(0, 4) }}]:</template
      >
      <span v-html="formatAnsi(log.message)"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Log } from '@/stores/logsStore'

import { ref } from 'vue'
import { AnsiUp } from 'ansi_up'

// Import de la bibliothèque

import { useScrollToBottom } from './useScrollToBottom'

const props = defineProps<{
  showedLogs: Log[]
  showLineInfo: boolean
}>()

const ansiUp = new AnsiUp()
ansiUp.use_classes = false // Utilise des styles inline (plus simple pour débuter)

// Fonction pour transformer l'ANSI en HTML
const formatAnsi = (message: string) => {
  return ansiUp.ansi_to_html(message)
}

const logsContainer = ref<HTMLDivElement | null>(null)
const { handleScroll } = useScrollToBottom(
  logsContainer,
  () => props.showedLogs.length
)
</script>
