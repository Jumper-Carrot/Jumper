<template>
  <div class="flex h-full flex-col">
    <div class="flex h-full flex-col gap-2">
      <h2 class="text-lg font-semibold">Actions advanced settings</h2>
      <div class="pl-2">
        <div
          class="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-400"
        >
          <Switch v-model="allowActionWorkspaces" />
          Allow action workspaces
        </div>
      </div>
    </div>
    <div class="flex w-full flex-shrink-0 items-end justify-end gap-2 border-t">
      <Button size="sm" class="mt-2" @click="onSubmit">
        <Save />
        Save
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SystemInfo } from '@@types/system'
import { useSystemForm } from './useSystemForm'
import { useField } from 'vee-validate'
import { useSystemStore } from '@/stores/systemStore'
import { Button } from '@@materials/ui/button'
import { Save } from 'lucide-vue-next'
import { Switch } from '@@materials/ui/switch'
import { useConfirmToast } from '@/composables'

const props = defineProps<{
  systemInfo: SystemInfo
}>()

const { handleSubmit } = useSystemForm(props.systemInfo)

const { value: allowActionWorkspaces } = useField<boolean>('allowActionWorkspaces')

const systemStore = useSystemStore()

const onSubmit = handleSubmit(async (values) => {
  await useConfirmToast(
    async () => {
      await systemStore.updateSystemInfo(values)
    },
    {
      successTitle: `System settings edited.`,
      errorTitle: `Failed to update system settings.`
    }
  )
})
</script>
