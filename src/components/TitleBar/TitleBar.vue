<template>
  <div
    data-tauri-drag-region
    @click.stop
    class="fixed top-0 z-10000 flex h-[32px] items-center gap-1 bg-slate-100 pl-1
      dark:bg-slate-900 w-screen"
  >
    <img
      class="pointer-events-none ml-[2px] mt-px w-[23px]"
      src="@/assets/jumper-logo.png"
      alt="Jumper Logo"
    />
    <h1
      class="pointer-events-none text-xs font-medium text-slate-700 dark:text-slate-200"
    >
      Jumper
    </h1>
    <SearchBar class="m-auto" />
    <OptionsButtons />
    <WindowsMenu />
  </div>
</template>

<script setup lang="ts">
import WindowsMenu from './WindowsMenu.vue'
import OptionsButtons from './OptionsButtons.vue'
import SearchBar from './SearchBar.vue'
</script>
