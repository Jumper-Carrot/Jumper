<template>
  <button
    class="absolute -top-2 -right-2 z-10 rounded-full bg-slate-300 p-1 opacity-50
      transition-colors hover:bg-slate-400 hover:opacity-100"
    title="Hide Action"
  >
    <Eye class="h-4 w-4" />
    <EyeOff class="h-4 w-4" />
  </button>
</template>

<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'
</script>
