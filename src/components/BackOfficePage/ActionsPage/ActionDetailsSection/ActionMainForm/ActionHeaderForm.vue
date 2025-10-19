<template>
  <div class="flex w-full flex-col gap-3" v-if="actionDetailed">
    <div class="flex w-full gap-3">
      <ActionCardPreview
        :actionsComposable="actionsComposable"
        :cardOptions="cardOptions"
      />
      <div class="flex w-full flex-col">
        <div class="w-s flex items-center gap-3">
          <div
            class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-slate-100
              p-1 shadow-sm dark:bg-slate-800"
            :title="actionDetailed.data.type"
          >
            <Link v-if="actionDetailed.data.type == 'Link'" :size="12" />
            <img
              v-else-if="actionDetailed.data.type == 'Python'"
              src="/actions/python.png"
            />
            <img v-else src="/actions/windows-cmd.png" />
          </div>
          <div class="line-clamp-1 truncate font-semibold">
            {{ actionDetailed.name }}
          </div>
          <Badge
            v-if="workspaces && actionDetailed.workspace"
            variant="outline"
            class="ml-1 flex max-w-[150px] flex-shrink-0 items-center gap-1 rounded-md border-none
              bg-slate-100 py-0.5 text-sm shadow-sm dark:bg-slate-800"
          >
            <ComponentIcon :size="12" class="flex-shrink-0" />
            <p class="truncate">
              {{
                workspaces?.find((ws) => ws.id === actionDetailed?.workspace)
                  ?.name
              }}
            </p>
          </Badge>
          <div
            class="ml-auto size-2 flex-shrink-0 animate-pulse rounded-full"
            :class="{
              'bg-green-400': actionDetailed.isActive,
              'bg-slate-300': !actionDetailed.isActive
            }"
          />
          <Button
            class="ml-1 flex size-9 items-center justify-center bg-slate-50 p-2 text-sm
              text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:bg-slate-950
              dark:text-slate-200 dark:hover:bg-slate-800"
            variant="outline"
            @click.prevent="isVersionBarOpen = !isVersionBarOpen"
          >
            <GitCompareArrows :size="22" />
          </Button>
        </div>
        <p class="mr-[30%] line-clamp-2 pl-1 text-sm italic">
          {{ actionDetailed.description }}
        </p>
        <PermissionList :actionDetailed="actionDetailed" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Workspace } from '@@types'
import type { ActionsComposable } from '../../useActions'
import ActionCardPreview from './ActionCardPreview.vue'
import { Button } from '@@materials/ui/button'
import { Badge } from '@@materials/ui/badge'
import PermissionList from './PermissionList.vue'
import { Link, GitCompareArrows, ComponentIcon } from 'lucide-vue-next'

import { ref, onMounted, onBeforeUnmount } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const hasOverflow = ref(false)

let observer: ResizeObserver

onMounted(() => {
  if (containerRef.value) {
    const el = containerRef.value
    observer = new ResizeObserver(() => {
      hasOverflow.value = el.scrollHeight > el.clientHeight
    })
    observer.observe(el)
  }
})

onBeforeUnmount(() => {
  if (observer && containerRef.value) {
    observer.disconnect()
  }
})

const props = defineProps<{
  actionsComposable: ActionsComposable
  cardOptions?: string[] | null
  workspaces?: Workspace[] | null
}>()

const { actionDetailed } = props.actionsComposable

const isVersionBarOpen = defineModel<boolean>('isVersionBarOpen', {
  default: false
})
</script>
