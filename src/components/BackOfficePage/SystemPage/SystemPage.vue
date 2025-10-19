<template>
  <BackOfficePageLayout>
    <div class="mb-4 flex w-full flex-col gap-1 border-b px-1 pb-4">
      <div class="flex items-center space-x-2">
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200">
          System
        </h2>
      </div>
      <p class="text-sm text-slate-400 dark:text-slate-500">
        General Jumper settings
      </p>
    </div>
    <SystemForm v-if="systemInfo" :system-info="systemInfo" />
  </BackOfficePageLayout>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useSystemStore } from '@/stores/systemStore'
import BackOfficePageLayout from '../@common/BackOfficePageLayout.vue'
import SystemForm from './SystemForm.vue'

const { systemInfo } = storeToRefs(useSystemStore())
</script>
