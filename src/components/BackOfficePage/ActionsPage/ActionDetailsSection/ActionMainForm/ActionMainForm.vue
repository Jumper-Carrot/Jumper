<template>
  <Tabs default-value="action" class="h-full w-full">
    <div class="mb-4 flex w-full items-center justify-between border-b">
      <TabsList class="gap-1 rounded-b-none border-b-0 bg-transparent p-0">
        <TabsTrigger
          class="rounded-md rounded-b-none border border-b-2 border-transparent
            border-b-transparent hover:border-b-slate-200 hover:bg-slate-50
            data-[state=active]:border-slate-100
            data-[state=active]:border-b-slate-950
            data-[state=active]:bg-slate-50 dark:hover:border-b-slate-700
            dark:hover:bg-slate-800 dark:data-[state=active]:border-slate-800
            dark:data-[state=active]:border-b-slate-200
            dark:data-[state=active]:bg-slate-800"
          :value="'action'"
        >
          Action
        </TabsTrigger>
        <TabsTrigger
          v-for="tab in tabsTriggers ?? []"
          :key="tab.value"
          class="rounded-md rounded-b-none border border-b-2 border-transparent
            border-b-transparent hover:border-b-slate-200 hover:bg-slate-50
            data-[state=active]:border-slate-100
            data-[state=active]:border-b-slate-950
            data-[state=active]:bg-slate-50 dark:hover:border-b-slate-700
            dark:hover:bg-slate-800 dark:data-[state=active]:border-slate-800
            dark:data-[state=active]:border-b-slate-200
            dark:data-[state=active]:bg-slate-800"
          :value="tab.value"
        >
          {{ tab.label }}
        </TabsTrigger>
        <TabsTrigger
          class="rounded-md rounded-b-none border border-b-2 border-transparent
            border-b-transparent hover:border-b-slate-200 hover:bg-slate-50
            data-[state=active]:border-slate-100
            data-[state=active]:border-b-slate-950
            data-[state=active]:bg-slate-50 dark:hover:border-b-slate-700
            dark:hover:bg-slate-800 dark:data-[state=active]:border-slate-800
            dark:data-[state=active]:border-b-slate-200
            dark:data-[state=active]:bg-slate-800"
          :value="'advanced'"
        >
          Advanced
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
      <TabsContent value="advanced">
        <div class="flex flex-col gap-2 p-4">
          <slot name="advanced-tab">
            <AdvancedTab />
          </slot>
        </div>
      </TabsContent>
      <slot />
    </div>
  </Tabs>
</template>

<script setup lang="ts">
import type { ActionsComposable } from '../../useActions'
import type { Workspace } from '@@types'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@@materials/ui/tabs'
import ActionTab from './ActionTab.vue'
import AdvancedTab from './AdvancedTab.vue'

defineProps<{
  actionsComposable: ActionsComposable
  cardOptions?: string[] | null
  tabsTriggers?: Array<{ label: string; value: string }>
  workspaces?: Workspace[] | null
}>()
</script>
