<template>
  <div
    class="dark:bg-opacity-60 flex h-full w-[210px] shrink-0 scroll-py-36
      flex-col items-center border-r bg-slate-100 pt-2 pb-3
      dark:border-slate-700 dark:bg-slate-800"
    @click="() => (selection = [])"
  >
    <div class="w-full px-2" @click.stop>
      <Input v-model="search" class="h-[25px]" placeholder="Search" />
    </div>
    <div class="my-2 flex w-full grow flex-col gap-2 overflow-auto px-2 py-2">
      <p
        class="text-xs font-semibold text-slate-400 italic"
        v-if="executionsRunning.length"
      >
        Running
      </p>
      <Button
        variant="ghost"
        class="p-0"
        v-for="execution in executionsRunning"
        :key="execution.id"
        @click.exact.stop="select(execution)"
        @click.ctrl.stop="select(execution, { multiple: true })"
      >
        <div
          class="group dark:hover:bg-opacity-60 flex h-10 w-full flex-col
            items-start rounded-lg border py-0.5 pr-1 pl-2 shadow-2xs
            transition-all dark:bg-slate-800 dark:hover:bg-slate-700"
          :class="{
            [`border-slate-300 bg-white hover:bg-slate-50 hover:shadow-xs
            dark:border-slate-600`]: !selection.includes(execution.id),
            'ring-primary bg-slate-50 ring-2 dark:bg-slate-700':
              selection.includes(execution.id)
          }"
        >
          <div class="flex w-full items-center">
            <p
              class="truncate text-sm leading-[17px] font-semibold
                text-slate-800 dark:text-slate-200"
            >
              {{ execution.namespace }}
            </p>
            <p
              v-if="execution.mode == 'get-options'"
              class="ml-0.5 rounded-md bg-blue-300 px-1 text-[12px]
                leading-[17px] text-slate-800 shadow-xs"
            >
              O
            </p>
            <Button
              variant="ghost"
              class="ml-auto h-4 p-0 text-slate-500 opacity-0
                group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-800"
              size="sm"
              title="Stop execution"
              @click.stop.prevent="
                executionsStore.removeExecution(execution.id)
              "
            >
              <X />
            </Button>
          </div>
          <p class="w-full truncate text-left text-xs text-slate-400 italic">
            {{ getExecTime(execution.runTimestamp) }}
            <span v-if="execution.selectedOption">
              - {{ execution.selectedOption }}</span
            >
          </p>
        </div>
      </Button>
      <p
        class="text-xs font-semibold text-slate-400 italic"
        v-if="endedExecutions.length"
      >
        Ended
      </p>
      <Button
        variant="ghost"
        class="p-0"
        v-for="execution in endedExecutions"
        :key="execution.id"
        @click.exact.stop="select(execution)"
        @click.ctrl.stop="select(execution, { multiple: true })"
      >
        <div
          class="group dark:hover:bg-opacity-60 flex h-10 w-full flex-col
            items-start rounded-lg border py-0.5 pr-1 pl-2 shadow-2xs
            transition-all dark:bg-slate-800 dark:hover:bg-slate-700"
          :class="{
            [`border-slate-300 bg-slate-100 hover:bg-slate-50 hover:shadow-xs
            dark:border-slate-600`]: !selection.includes(execution.id),
            'ring-primary bg-slate-50 ring-2 dark:bg-slate-700':
              selection.includes(execution.id)
          }"
        >
          <div class="flex w-full items-center gap-0.5">
            <p
              class="truncate text-sm leading-[17px] font-semibold
                text-slate-800 dark:text-slate-200"
            >
              {{ execution.namespace }}
            </p>
            <p
              v-if="execution.mode == 'get-options'"
              class="ml-0.5 rounded-md bg-blue-300 px-1 text-[12px]
                leading-[17px] text-slate-800 shadow-xs"
            >
              O
            </p>
            <Button
              variant="ghost"
              class="ml-auto h-4 p-0 text-slate-500 opacity-0
                group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-800"
              size="sm"
              title="Stop execution"
              @click.stop.prevent="
                executionsStore.removeExecution(execution.id)
              "
            >
              <X />
            </Button>
          </div>
          <p class="w-full truncate text-left text-xs text-slate-400 italic">
            {{ getExecTime(execution.runTimestamp) }}
            <span v-if="execution.selectedOption">
              - {{ execution.selectedOption }}</span
            >
          </p>
        </div>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CodeExec } from '@/composables/useCodeExec/useCodeExec'

import { computed, ref } from 'vue'
import { X } from 'lucide-vue-next'

import { useExecutionsStore } from '@/stores'

import { Button } from '@@materials/ui/button'
import Input from '@@materials/ui/input/Input.vue'

const executionsStore = useExecutionsStore()

const props = defineProps<{
  showOptionsExec: boolean
}>()

const selection = defineModel<CodeExec['id'][]>('selection', {
  default: () => []
})

const search = ref('')

const select = (
  execution: CodeExec,
  options: {
    multiple?: boolean
  } = {}
) => {
  if (options.multiple) {
    selection.value.push(execution.id)
  } else {
    selection.value = [execution.id]
  }
}
const executionsRunning = computed(() =>
  filterExecutions.value.filter(execution => execution.isRunning)
)

const endedExecutions = computed(() =>
  filterExecutions.value.filter(execution => !execution.isRunning)
)

const filterExecutions = computed(() => {
  return executionsStore.executions
    .filter(execution => {
      if (!search.value) return true
      return (
        execution.namespace
          .toLowerCase()
          .includes(search.value.toLowerCase()) ||
        execution.id.toLowerCase().includes(search.value.toLowerCase())
      )
    })
    .filter(execution => {
      if (props.showOptionsExec) return true
      return execution.mode !== 'get-options'
    })
    .sort((a, b) => {
      return (
        new Date(b.runTimestamp ?? 0).getTime() -
        new Date(a.runTimestamp ?? 0).getTime()
      )
    })
})

const getExecTime = (timestamp: string | null) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
</script>
