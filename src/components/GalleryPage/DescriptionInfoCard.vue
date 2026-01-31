<template>
  <div
    class="flex-col h-36 w-80 max-sm:w-70 bg-white border dark:bg-slate-800 rounded-sm shadow-lg absolute bottom-4 flex transition-all p-3 px-4 duration-200 gap-1.5"
  >
    <div class="flex h-8 gap-2">
      <img
        v-if="action?.thumbnailUrl"
        class="h-full w-8 rounded-md object-contain"
        :src="action?.thumbnailUrl"
        :alt="action?.name"
      />
      <div
        v-else
        class="flex h-full w-8 items-center justify-center bg-slate-50 rounded-md dark:bg-slate-600"
      >
        <Carrot :size="20" class="text-slate-300 dark:text-slate-400" />
      </div>
      <h3
        class="truncate font-semibold text-lg text-slate-800 dark:text-slate-300"
      >
        {{ action?.name }}
      </h3>
    </div>
    <div class="text-sm line-clamp-4 text-slate-500 dark:text-slate-300">
      {{ action?.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlayableAction } from '@@types/action'
import { Carrot } from 'lucide-vue-next'

defineProps<{
  action: PlayableAction | null
}>()
</script>
