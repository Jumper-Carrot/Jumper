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
      <div
        class="flex h-[100px] max-w-[200px] flex-col gap-1 rounded-md border bg-slate-50 p-3
          py-2"
      >
        <h2
          class="text-md mb-1 font-semibold text-slate-800 dark:text-slate-200"
        >
          Versions
        </h2>
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
          Carrot: {{ carrotVersion }}
        </div>
      </div>

      <div
        class="mb-auto flex h-[100px] max-w-[400px] flex-col gap-1 rounded-md border
          bg-slate-50 p-3 py-2"
      >
        <h2
          class="text-md mb-1 flex items-center gap-1.5 font-semibold text-slate-800
            dark:text-slate-200"
        >
          <img
            class="inline h-4"
            src="@/assets/github.svg"
            alt="Jumper logo"
          />Contribute
        </h2>
        <div
          class="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400"
        >
          Jumper:
          <a
            href="https://github.com/LibertAntoine/Jumper"
            class="text-blue-600 hover:underline dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
            >https://github.com/LibertAntoine/Jumper</a
          >
        </div>
        <div
          class="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400"
        >
          Carrot:
          <a
            href="https://github.com/LibertAntoine/Carrot"
            class="text-blue-600 hover:underline dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
            >https://github.com/LibertAntoine/Carrot</a
          >
        </div>
      </div>
      <div class="w-[160px] text-sm italic text-slate-400 dark:text-slate-400">
        <p>Jumper & Carrot</p>
        <p>Author: Libert Antoine</p>
        <p>Licence: Apache 2.0</p>
      </div>
    </div>
  </BackOfficePageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Carrot } from 'lucide-vue-next'
import BackOfficePageLayout from '../@common/BackOfficePageLayout.vue'
import { getVersion } from '@tauri-apps/api/app'
import jumper from '@/services/jumper'

const jumperVersion = ref<string | null>(null)
const carrotVersion = ref<string | null>(null)

getVersion().then((version) => {
  jumperVersion.value = version
})

jumper.client.getInfo().then((info) => {
  carrotVersion.value = info.version
})
</script>
