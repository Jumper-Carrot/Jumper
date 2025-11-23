<template>
  <button
    class="custom-shadow flex flex-col items-center justify-center gap-2 rounded-md bg-slate-100 p-2 pb-1 transition-all dark:bg-slate-800"
    :class="{
      'hover:shadow-md': !hasOptions || optionsExec?.options.value,
      'pointer-events-none cursor-not-allowed opacity-65':
        hasOptions && !optionsExec?.options.value?.length,
      'pointer-events-none cursor-not-allowed': readonly
    }"
    @click="execAction(null)"
  >
    <div
      class="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-md p-[2px]"
    >
      <img
        v-if="action.thumbnailUrl"
        class="h-full w-full rounded-md object-contain"
        :src="action.thumbnailUrl"
        :alt="action.name"
      />
      <div v-else class="flex h-full w-full items-center justify-center">
        <Carrot :size="60" class="ml-2 text-slate-300" />
      </div>
    </div>
    <div class="flex grow flex-col gap-0.5">
      <h2
        class="text-md w-full overflow-hidden text-center font-semibold break-all text-slate-700 dark:text-slate-200"
        :class="{
          'line-clamp-2': !hasOptions,
          'line-clamp-1': hasOptions
        }"
      >
        {{ action.name }}
      </h2>
      <div class="flex w-full items-center justify-center" @click.stop>
        <Combobox
          v-if="hasOptions"
          class="text-md ml-0!important h-[18px] w-[115px] gap-0 truncate border-none bg-slate-100 px-0.5 text-xs text-slate-400 italic hover:bg-slate-50 hover:text-slate-700 dark:bg-slate-700 dark:text-slate-400"
          :class="{
            'pointer-events-none cursor-not-allowed':
              !optionsExec?.options.value?.length || readonly
          }"
          :items="optionsExec?.options.value ?? []"
          list-item-class="cursor-pointer p-1 data-highlighted:bg-slate-200 dark:data-highlighted:bg-slate-800"
          pop-ever-class="bg-slate-100 dark:bg-slate-700"
          disableCheck
          popover-custom-width
          @click.stop
        >
          <template #selection>
            <p
              class="ml-[16px] w-[100px] justify-center truncate text-center"
              v-if="readonly"
            ></p>
            <p
              class="ml-[16px] w-[100px] justify-center truncate text-center"
              v-else-if="optionsExec?.options.value?.length"
            >
              {{ optionsExec?.options.value[0] }}
            </p>
            <p
              class="ml-[16px] flex w-[100px] justify-center truncate"
              v-else-if="optionsExec?.isRunning.value"
            >
              <Loader2 class="animate-spin text-slate-500" />
            </p>
            <p
              class="ml-[16px] flex w-[100px] justify-center truncate"
              v-else-if="optionsExec?.options.value?.length == 0"
            >
              <Minus />
            </p>
            <p class="ml-[16px] flex w-[100px] justify-center truncate" v-else>
              <X class="text-red-500" />
            </p>
          </template>
          <template #list-item="{ label }"
            ><p
              class="w-full truncate text-center text-xs font-semibold text-slate-500 italic dark:text-slate-400"
              @click="() => execAction(label as string)"
            >
              {{ label }}
            </p>
          </template>
        </Combobox>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { PlayableAction } from '@@types'

import { Carrot, Loader2, Minus, X } from 'lucide-vue-next'

import { useActionExecStore } from '@/stores'

import { Combobox } from '@@materials/input'
import { useToast } from '@@materials/ui/toast'

const props = defineProps<{
  action: PlayableAction
  readonly?: boolean
}>()

const useActionExec = useActionExecStore()

const { toast } = useToast()

const { hasOptions, getOptions, exec } = useActionExec.useAction(props.action)
const optionsExec = getOptions()

if (
  !props.readonly &&
  optionsExec &&
  !optionsExec?.isRunning.value &&
  !optionsExec?.options.value
) {
  optionsExec?.exec()
}

const execAction = async (option: string | null) => {
  if (optionsExec?.isRunning.value || props.readonly) return
  if (hasOptions.value && !optionsExec?.options.value) return
  const opt = option || optionsExec?.options.value?.[0] || null
  await exec(opt)
  let title = `Run ${props.action.name}`
  if (opt) {
    title += ` - ${opt}`
  }
  toast({
    title,
    duration: 2000
  })
}
</script>
