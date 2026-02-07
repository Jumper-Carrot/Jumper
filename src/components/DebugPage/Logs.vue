<template>
  <div
    ref="logsContainer"
    class="log-scrollbar grow overflow-auto bg-slate-200 shadow-inner
      dark:bg-slate-800"
  >
    <DynamicScroller
      :items="showedLogs"
      :min-item-size="32"
      key-field="timestamp"
      :onScroll="handleScroll"
      class="h-[calc(100vh-54px)] grow"
    >
      <template v-slot="{ item: log, index: i, active }">
        <DynamicScrollerItem
          :item="log"
          :active="active"
          :size-dependencies="[
            log.message,
            log.level,
            log.option,
            log.namespace,
            log.timestamp,
            showLineInfo
          ]"
          :data-index="i"
        >
          <div
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
            <template v-if="showLineInfo">
              {{ log.timestamp }} [{{ log.namespace }}]
              <span> {{ log.option ? ` | ${log.option}` : '' }} </span> -
              {{ log.execId.slice(0, 4) }}]:
            </template>
            <span v-html="formatAnsi(log.message)"></span>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import type { Log } from '@/stores/logsStore'

import { ref } from 'vue'
import { AnsiUp } from 'ansi_up'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import { useScrollToBottom } from './useScrollToBottom'

const props = defineProps<{
  showedLogs: Log[]
  showLineInfo: boolean
}>()

const ansiUp = new AnsiUp()
ansiUp.use_classes = false
const formatAnsi = (message: string) => ansiUp.ansi_to_html(message)

const logsContainer = ref<HTMLDivElement | null>(null)

const { handleScroll } = useScrollToBottom(
  logsContainer,
  () => props.showedLogs.length
)
</script>
