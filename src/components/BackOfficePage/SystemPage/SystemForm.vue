<template>
  <div class="flex h-full flex-col">
    <div class="flex h-full flex-col gap-4">
      <div class="flex flex-col gap-2">
        <h2 class="font-semibold">Actions advanced settings</h2>
        <div class="pl-2">
          <div
            class="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400"
          >
            <Switch v-model="allowActionWorkspaces" />
            Allow action workspaces
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h2 class="font-semibold">Appearance preferences</h2>
        <div
          class="pl-2 flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400"
        >
          <Switch v-model="allowBackgroundImage" />
          Use custom background images
        </div>
        <div class="flex gap-2 pl-2 ">
          <div
            class="w-[200px] overflow-hidden"
            :class="{ 'opacity-50': !allowBackgroundImage }"
          >
            <AspectRatio
              :ratio="16 / 9"
              class="h-full w-full rounded-sm bg-slate-100 dark:bg-slate-800"
            >
              <img
                v-if="systemInfo.defaultBackgroundImageUrl"
                :src="systemInfo.defaultBackgroundImageUrl"
                alt="Default Background Image"
                class="h-full w-full rounded-md object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center text-sm text-slate-400
                  dark:text-slate-500"
              >
                <Carrot class="h-9 w-9 text-slate-300 dark:text-slate-500" />
              </div>
            </AspectRatio>
          </div>

          <div class="flex flex-col items-start gap-2 pl-2">
            <div
              class="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400"
            >
              <Switch
                v-model="allowUserCustomBackgroundImage"
                :disabled="!allowBackgroundImage"
              />
              <p :class="{ 'opacity-50': !allowBackgroundImage }">
                Allow user to set custom background images
              </p>
            </div>
            <div class="flex flex-col items-start gap-1">
              <EditDefaultBackgroundImage
                :system-info="systemInfo"
                :disabled="!allowBackgroundImage"
              />
              <DeleteBackgroundImageButton
                v-if="systemInfo.defaultBackgroundImageUrl"
                class="mt-2"
                :disabled="!allowBackgroundImage"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-3 pl-2">
        <div
          class="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400"
        >
          <Switch v-model="allowActionSections" />
          Allow action sections
        </div>
        <div
          class="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400"
        >
          <Switch v-model="allowUsersToHideActions" />
          Allow users to hide actions
        </div>
      </div>
    </div>
    <div class="flex w-full shrink-0 items-end justify-end gap-2 border-t">
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
import { Carrot, Save } from 'lucide-vue-next'
import { Switch } from '@@materials/ui/switch'
import { AspectRatio } from '@@materials/ui/aspect-ratio'
import { useConfirmToast } from '@/composables'
import EditDefaultBackgroundImage from './modals/EditDefaultBackgroundImage.vue'
import DeleteBackgroundImageButton from './modals/DeleteBackgroundImageButton.vue'

const props = defineProps<{
  systemInfo: SystemInfo
}>()

const { handleSubmit } = useSystemForm(props.systemInfo)

const { value: allowActionWorkspaces } = useField<boolean>(
  'allowActionWorkspaces'
)
const { value: allowUserCustomBackgroundImage } = useField<boolean>(
  'allowUserCustomBackgroundImage'
)

const { value: allowBackgroundImage } = useField<boolean>(
  'allowBackgroundImage'
)

const { value: allowUsersToHideActions } = useField<boolean>(
  'allowUsersToHideActions'
)

const { value: allowActionSections } = useField<boolean>('allowActionSections')

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
