<template>
  <BackOfficePageLayout>
    <div class="mb-4 flex w-full flex-col gap-1 border-b px-1 pb-4">
      <div class="flex items-center space-x-2">
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Info page
        </h2>
      </div>
      <p class="text-sm text-slate-400 dark:text-slate-500">
        Get information about Jumper application.
      </p>
    </div>
    <div class="flex h-full w-full flex-col gap-4">
      <InfoBlock class="h-[100px] max-w-[350px] shrink-0">
        <template #title>Versions</template>
        <template #default>
          <div
            class="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400"
          >
            <img
              class="inline h-4"
              src="@/assets/jumper-logo.png"
              alt="Jumper logo"
            />
            Jumper: {{ jumperVersion }}
          </div>
          <div
            class="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400"
          >
            <Carrot class="inline h-5 w-[21px] text-orange-500" />
            Carrot: {{ backendInfo?.version }}
            <span class="italic font-normal">({{ getBackendHost() }})</span>
          </div>
        </template>
      </InfoBlock>
      <InfoBlock class="h-[75px] max-w-[350px] shrink-0">
        <template #title
          ><MessageCircleQuestion class="size-4.5" />Help</template
        >
        <template #default>
          <div
            class="flex items-center gap-1 ml-1 text-sm font-semibold text-slate-600 dark:text-slate-400"
          >
            Jumper documentation:
            <a
              href="https://jumper-app.com"
              class="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
              >https://jumper-app.com</a
            >
          </div>
        </template>
      </InfoBlock>
      <InfoBlock class="h-[150px] max-w-[400px] shrink-0 mb-auto">
        <template #title
          ><img
            class="inline h-4"
            src="@/assets/github.svg"
            alt="Jumper logo"
          />Contribute</template
        >

        <template #default>
          <div
            class="flex flex-col gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400"
          >
            <div class="italic mb-1">
              Found a bug or have a feature request? <br />
              Please visit our GitHub repositories:
            </div>
            <div
              class="flex items-center gap-1 ml-1 text-sm font-semibold text-slate-600 dark:text-slate-400"
            >
              Jumper:
              <a
                href="https://github.com/Jumper-Carrot/Jumper"
                class="text-blue-600 hover:underline dark:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
                >https://github.com/Jumper-Carrot/Jumper</a
              >
            </div>
            <div
              class="flex items-center gap-1 ml-1 text-sm font-semibold text-slate-600 dark:text-slate-400"
            >
              Carrot:
              <a
                href="https://github.com/Jumper-Carrot/Carrot"
                class="text-blue-600 hover:underline dark:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
                >https://github.com/Jumper-Carrot/Carrot</a
              >
            </div>
          </div>
        </template>
      </InfoBlock>
      <div class="w-40 text-sm italic text-slate-400 dark:text-slate-400">
        <p>Jumper & Carrot</p>
        <p>Author: Libert Antoine</p>
        <p>Licence: Apache 2.0</p>
      </div>
    </div>
  </BackOfficePageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getVersion } from '@tauri-apps/api/app'
import { Carrot, MessageCircleQuestion } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import { useBackendInfoStore } from '@/stores'

import BackOfficePageLayout from '../@common/BackOfficePageLayout.vue'
import InfoBlock from './InfoBlock.vue'

const jumperVersion = ref<string | null>(null)

getVersion().then(version => {
  jumperVersion.value = version
})

const backendInfoStore = useBackendInfoStore()
const { getBackendHost } = backendInfoStore
const { backendInfo } = storeToRefs(backendInfoStore)
</script>
