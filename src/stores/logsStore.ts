import { computed, ref } from 'vue'
import * as tauriLog from '@tauri-apps/plugin-log'
import { defineStore } from 'pinia'

export type Log = {
  level: 'info' | 'error' | 'warn' | 'debug' | 'trace'
  execId: string
  timestamp: string
  namespace: string
  option: string | null
  message: string
}

const MAX_LOGS_PER_EXEC = 1000
const LOG_RETENTION_MS = 1000 * 60 * 60 * 4 // 4 hours
const LOG_CLEANUP_INTERVAL_MS = 1000 * 60 * 15 // 15 minutes
const MAX_LOG_RETENTION_THRESHOLD = 10000

export const useLogsStore = defineStore('logsConfig', () => {
  const logsByExec = ref<Record<string, Log[]>>({})
  const logs = computed(() =>
    Object.values(logsByExec.value)
      .flat()
      .toSorted(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .toReversed()
  )

  const pushLog = (log: Omit<Log, 'timestamp'>) => {
    tauriLog[log.level](log.message)
    if (logsByExec.value[log.execId] === undefined) {
      logsByExec.value[log.execId] = []
    }
    const execLogs = logsByExec.value[log.execId]
    execLogs.push({
      ...log,
      timestamp: new Date().toISOString()
    })
    if (execLogs.length > MAX_LOGS_PER_EXEC) {
      execLogs.shift()
    }
  }

  const clearExecLog = (execId: string) => {
    delete logsByExec.value[execId]
  }

  const clearAll = () => {
    logsByExec.value = {}
  }

  // Clear logs older than LOG_RETENTION_MS every LOG_CLEANUP_INTERVAL_MS
  // if more than MAX_LOG_RETENTION_THRESHOLD logs are present
  setInterval(() => {
    if (logs.value.length < MAX_LOG_RETENTION_THRESHOLD) return
    const cutoff = Date.now() - LOG_RETENTION_MS
    for (const execId in logsByExec.value) {
      logsByExec.value[execId] = logsByExec.value[execId].filter(
        log => new Date(log.timestamp).getTime() >= cutoff
      )
      if (logsByExec.value[execId].length === 0) {
        delete logsByExec.value[execId]
      }
    }
  }, LOG_CLEANUP_INTERVAL_MS)

  return {
    logs,
    logsByExec,
    pushLog,
    clearExecLog,
    clearAll
  }
})
