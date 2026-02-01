<template>
  <div
    class="flex flex-col gap-1 rounded-md border bg-slate-50 p-3 py-2
      dark:bg-slate-800"
  >
    <h2
      class="text-md mb-1 flex items-center gap-1.5 font-semibold text-slate-800
        dark:text-slate-200"
    >
      <slot name="title">Title</slot>
    </h2>
    <div
      class="flex flex-col gap-1 text-sm font-semibold text-slate-600
        dark:text-slate-400"
    >
      <slot>Content</slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
