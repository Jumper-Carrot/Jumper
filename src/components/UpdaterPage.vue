<template>
  <div
    data-tauri-drag-region
    @click.stop
    class="flex h-full w-full flex-col items-center justify-center gap-4"
  >
    <img
      class="pointer-events-none mt-px ml-[2px] h-[80px]"
      src="@/assets/jumper-logo.png"
      alt="Jumper Logo"
    />
    <Loader2 class="mt-3 size-12 animate-spin text-slate-400" />
    <p class="font-semibold text-slate-400">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { getAllWindows, getCurrentWindow } from '@tauri-apps/api/window'
import { onMounted, ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useUpdater } from '@/composables/useUpdater'

const text = ref('Searching for updates...')
const updater = useUpdater()

onMounted(async () => {
  await updater.check()
  if (updater.status.value === 'UPDATE-AVAILABLE') {
    text.value = `Download Update (${updater.getNewVersion()})`
    await updater.download()
    text.value = `Installing Update (${updater.getNewVersion()})`
    await updater.install()
  }

  const windows = await getAllWindows()
  const updaterWindow = getCurrentWindow()
  const mainWindow = windows.find((window) => window.label === 'main') ?? null
  if (mainWindow) {
    mainWindow.show()
    updaterWindow.close()
  }
})
</script>
