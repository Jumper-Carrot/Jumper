<template>
  <div class="relative">
    <Search
      class="text-muted-foreground absolute top-[9px] left-2.5 h-[16px]
        w-[16px]"
    />
    <Input
      type="search"
      v-model="search"
      :placeholder="placeholder || 'Search...'"
      class="bg-background h-[32px] w-full rounded-lg pl-8 text-slate-800
        dark:text-slate-200"
    />
  </div>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

import { Input } from '@@materials/ui/input'

defineProps<{
  placeholder?: string
}>()

const search = defineModel<string>()
</script>
