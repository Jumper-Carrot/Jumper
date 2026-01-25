<template>
  <div class="flex h-full">
    <SideBar v-model:selection="selection" :showOptionsExec="showOptionsExec" />
    <div class="flex w-full flex-col">
      <Logs :showedLogs="showedLogs" :showLineInfo="showLineInfo" />
      <BottomBar
        :showedLogs="showedLogs"
        v-model:search="logSearch"
        v-model:showOptionsExec="showOptionsExec"
        v-model:showStrOut="showStdOut"
        v-model:showStrErr="showStdErr"
        v-model:showLineInfo="showLineInfo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CodeExec } from '@/composables/useCodeExec/useCodeExec'

import { computed, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'

import { useExecutionsStore } from '@/stores'
import { useLogsStore } from '@/stores/logsStore'

import BottomBar from './BottomBar.vue'
import Logs from './Logs.vue'
import SideBar from './SideBar.vue'

const executionsStore = useExecutionsStore()
const logsStore = useLogsStore()

const showOptionsExec = ref(false)
const logSearch = ref('')
const selection = ref<CodeExec['id'][]>([])
const showStdOut = useStorage('debug-show-stdout', true)
const showStdErr = useStorage('debug-show-stderr', true)
const showLineInfo = useStorage('debug-show-line-info', true)

const showedLogs = computed(() => {
  const logs = logsStore.logs.filter(log => {
    if (showOptionsExec.value) return true
    const exec = executionsStore.executions.find(
      execution => execution.id === log.execId
    )
    if (exec && exec.mode !== 'get-options') return true
  })
  if (logSearch.value) {
    return logs.filter(log => {
      return (
        log.message.toLowerCase().includes(logSearch.value.toLowerCase()) ||
        log.namespace.toLowerCase().includes(logSearch.value.toLowerCase()) ||
        (log.option &&
          log.option.toLowerCase().includes(logSearch.value.toLowerCase())) ||
        log.execId.toLowerCase().includes(logSearch.value.toLowerCase())
      )
    })
  }
  return logs.filter(log => {
    if (log.level !== 'error' && !showStdOut.value) return false
    if (log.level === 'error' && !showStdErr.value) return false
    if (selection.value.length && !selection.value.includes(log.execId))
      return false
    return true
  })
})

watch(
  () => executionsStore.executions,
  (executions: CodeExec[]) => {
    selection.value = selection.value.filter(id =>
      executions.some(execution => execution.id === id)
    )
  }
)
</script>
