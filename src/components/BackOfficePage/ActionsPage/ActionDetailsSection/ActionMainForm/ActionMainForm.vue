<template>
  <Tabs default-value="action" class="h-full w-full">
    <div class="mb-4 flex w-full items-center justify-between border-b">
      <TabsList class="gap-1 rounded-b-none border-b-0 bg-transparent p-0">
        <TabsTrigger
          v-if="tabsTriggers"
          class="rounded-md rounded-b-none border border-b-2 border-transparent
            border-b-transparent hover:border-b-slate-200 hover:bg-slate-50
            data-[state=active]:border-slate-100 data-[state=active]:border-b-slate-950
            data-[state=active]:bg-slate-50 dark:hover:border-b-slate-700
            dark:hover:bg-slate-800 dark:data-[state=active]:border-slate-800
            dark:data-[state=active]:border-b-slate-200 dark:data-[state=active]:bg-slate-800"
          v-for="tab in [
            { label: 'Action', value: 'action' },
            ...(tabsTriggers ?? [])
          ]"
          :value="tab.value"
        >
          {{ tab.label }}
        </TabsTrigger>
      </TabsList>
    </div>
    <div class="h-[calc(100%-70px)] overflow-y-auto">
      <TabsContent value="action">
        <ActionTab
          :actions-composable="actionsComposable"
          :card-options="cardOptions"
          :workspaces="workspaces"
        >
          <slot name="action-tab" />
        </ActionTab>
      </TabsContent>
      <slot />
    </div>
  </Tabs>
</template>

<script setup lang="ts">
import type { Workspace } from '@@types'
import type { ActionsComposable } from '../../useActions'
import ActionTab from './ActionTab.vue'
import { TabsContent, TabsList, TabsTrigger, Tabs } from '@@materials/ui/tabs'

defineProps<{
  actionsComposable: ActionsComposable
  cardOptions?: string[] | null
  tabsTriggers?: Array<{ label: string; value: string }>
  workspaces?: Workspace[] | null
}>()
</script>
