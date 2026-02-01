<template>
  <BackOfficePageLayout v-if="user">
    <div class="mb-4 flex w-full flex-col gap-1 border-b px-1 pb-4">
      <div class="flex items-center space-x-2">
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Appearance preferences
        </h2>
      </div>
      <p class="text-sm text-slate-400 dark:text-slate-500">
        Edit the appearance of the app
      </p>
    </div>
    <div class="flex h-full flex-col gap-4">
      <div class="flex w-full flex-col gap-2 overflow-auto pl-1">
        <Label>Color mode</Label>
        <div class="w-[110px]">
          <Select v-model:model-value="colorMode">
            <SelectTrigger class="h-[35px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                :value="item.value"
                v-for="item of items"
                :key="item.value"
              >
                <p class="flex items-center gap-2">
                  <component :is="item.icon" class="h-4 w-4" /> {{ item.text }}
                </p>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        class="flex w-full flex-col gap-2 overflow-auto pl-1"
        v-if="systemInfo && systemInfo.allowShowingDescription"
      >
        <Label class="">Description</Label>
        <div
          class="flex items-center gap-2 text-sm font-semibold text-slate-600
            dark:text-slate-400"
        >
          <Switch v-model="allowShowingDescription" />
          <p>Allow showing description on card hover</p>
        </div>
      </div>
      <div class="flex grow flex-col gap-2 pl-1">
        <div
          v-if="
            systemInfo &&
            systemInfo.allowBackgroundImage &&
            systemInfo.allowUserCustomBackgroundImage
          "
        >
          <Label>Gallery Background</Label>
          <div class="flex gap-2">
            <div class="w-[200px] overflow-hidden">
              <AspectRatio
                :ratio="16 / 9"
                class="h-full w-full rounded-sm bg-slate-100 dark:bg-slate-800"
              >
                <img
                  v-if="
                    (user && user.preferences.customBackgroundImageUrl) ||
                    (!disableDefaultBackgroundImage &&
                      systemInfo.defaultBackgroundImageUrl)
                  "
                  :src="
                    user.preferences.customBackgroundImageUrl ||
                    systemInfo.defaultBackgroundImageUrl ||
                    ''
                  "
                  alt="Custom Background Image"
                  class="h-full w-full rounded-md object-cover"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center text-sm
                    text-slate-400 dark:text-slate-500"
                >
                  <Carrot class="h-9 w-9 text-slate-300 dark:text-slate-500" />
                </div>
              </AspectRatio>
            </div>
            <div class="flex flex-col items-start gap-2 pl-2">
              <div
                class="flex items-center gap-2 text-sm font-semibold
                  text-slate-600 dark:text-slate-400"
              >
                <Switch v-model="disableDefaultBackgroundImage" />
                <p>Disable default background image</p>
              </div>
              <div class="flex flex-col items-start gap-1">
                <EditGalleryBackgroundImage
                  :userPreferences="user.preferences"
                />
                <DeleteBackgroundImageButton
                  v-if="user.preferences.customBackgroundImageUrl"
                  class="mt-2"
                />
              </div>
            </div>
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
  </BackOfficePageLayout>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Carrot, Save, Sun, SunMoon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'

import { useAuthUserStore, useSystemStore } from '@/stores'
import { useConfirmToast } from '@/composables'

import { AspectRatio } from '@@materials/ui/aspect-ratio'
import { Button } from '@@materials/ui/button'
import { Label } from '@@materials/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@@materials/ui/select'
import { Switch } from '@@materials/ui/switch'
import Moon from '@/components/GalleryPage/Moon.vue'
import BackOfficePageLayout from '../../@common/BackOfficePageLayout.vue'
import DeleteBackgroundImageButton from './modals/DeleteBackgroundImageButton.vue'
import EditGalleryBackgroundImage from './modals/EditGalleryBackgroundImage.vue'
import { useUserPreferencesForm } from './useUserPreferencesForm'

const { systemInfo } = storeToRefs(useSystemStore())
const authUserStore = useAuthUserStore()
const { user } = storeToRefs(authUserStore)

const { handleSubmit } = useUserPreferencesForm(user.value?.preferences)

const { value: disableDefaultBackgroundImage } = useField<boolean>(
  'disableDefaultBackgroundImage'
)

const { value: allowShowingDescription } = useField<boolean>(
  'allowShowingDescription'
)

const { store: colorMode } = useColorMode({ disableTransition: false })

const items = [
  { text: 'Light', value: 'light', icon: Sun },
  { text: 'Dark', value: 'dark', icon: Moon },
  { text: 'Auto', value: 'auto', icon: SunMoon }
]

const onSubmit = handleSubmit(async values => {
  await useConfirmToast(
    async () => {
      await authUserStore.updateUserPreferences(values)
    },
    {
      successTitle: `User preferences edited.`,
      errorTitle: `Failed to update user preferences.`
    }
  )
})
</script>
