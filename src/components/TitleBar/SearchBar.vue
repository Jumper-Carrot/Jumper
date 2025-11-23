<template>
  <div
    class="relative min-w-0 px-2 transition-all duration-300 focus-within:opacity-100
      hover:opacity-100"
    :class="{
      'opacity-50': !search
    }"
  >
    <template v-if="route.matched.some((m) => m.name === 'home')">
      <Input
        v-model="search"
        type="search"
        placeholder="Search..."
        class="h-5 max-w-full rounded-sm text-xs transition-all duration-300
          focus:w-[400px] pl-[19px]!"
        :class="{
          'w-[120px]': !search,
          'w-[400px]': search
        }"
        size="sm"
      />
      <Search
        class="absolute left-[13px] top-1 h-3 w-3 text-muted-foreground"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Input } from '@@materials/form'
import { Search } from 'lucide-vue-next'
import { useTitleBarOptionsStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const route = useRoute()

const { search } = storeToRefs(useTitleBarOptionsStore())
</script>
