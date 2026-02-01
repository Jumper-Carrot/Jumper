<template>
  <div
    class="absolute bottom-4 flex h-36 w-80 flex-col gap-1.5 rounded-sm border
      bg-white p-3 px-4 shadow-lg transition-all duration-200 max-sm:w-70
      dark:bg-slate-800"
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
        class="flex h-full w-8 items-center justify-center rounded-md
          bg-slate-50 dark:bg-slate-600"
      >
        <Carrot :size="20" class="text-slate-300 dark:text-slate-400" />
      </div>
      <h3
        class="truncate text-lg font-semibold text-slate-800
          dark:text-slate-300"
      >
        {{ action?.name }}
      </h3>
    </div>
    <div class="line-clamp-4 text-sm text-slate-500 dark:text-slate-300">
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
