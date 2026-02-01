<template>
  <div
    class="relative min-w-0 px-2 transition-all duration-300
      focus-within:opacity-100 hover:opacity-100"
    :class="{
      'opacity-50': !search
    }"
  >
    <template v-if="route.matched.some(m => m.name === 'home')">
      <Input
        v-model="search"
        type="search"
        placeholder="Search..."
        class="h-5 max-w-full rounded-sm pl-[19px]! text-xs transition-all
          duration-300 focus:w-[400px]"
        :class="{
          'w-[120px]': !search,
          'w-[400px]': search
        }"
        size="sm"
      />
      <Search
        class="text-muted-foreground absolute top-1 left-[13px] h-3 w-3"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { useTitleBarOptionsStore } from '@/stores'

import { Input } from '@@materials/form'

const route = useRoute()

const { search } = storeToRefs(useTitleBarOptionsStore())
</script>
