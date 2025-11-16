<template>
  <FormModal
    title="Edit default background image"
    :form="backgroundImageForm"
    description="Edit the background image by default for all users."
    :onSubmit="onSubmit"
    v-model:open="isModalOpen"
  >
    <template #trigger>
      <Button
        size="sm"
        class="mt-2 w-[200px] text-slate-600 dark:text-slate-400"
        variant="outline"
        :disabled="disabled"
      >
        Edit default background image
      </Button>
    </template>
    <template #default>
      <div class="flex flex-col">
        <AspectRatio
          :ratio="16 / 9"
          class="w-full rounded-sm bg-slate-100 dark:bg-slate-700"
        >
          <img
            v-if="newBackgroundImageUrl || systemInfo.defaultBackgroundImageUrl"
            :src="
              newBackgroundImageUrl ||
              systemInfo.defaultBackgroundImageUrl ||
              ''
            "
            alt="New Default Background Image Preview"
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
        <Button
          size="sm"
          class="mt-2 w-[120px] text-slate-600 dark:text-slate-400"
          variant="outline"
          @click.prevent="selectImage"
        >
          Select image
        </Button>
        <p class="mt-2 text-right text-xs text-slate-600 dark:text-slate-400">
          Saving the image will automatically apply the new background image for
          all users.
        </p>
      </div>
    </template>
  </FormModal>
</template>

<script setup lang="ts">
import type { SystemInfo } from '@@types'
import { ref, watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from '@@materials/ui/button'
import { FormModal } from '@@materials/modal'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { Carrot } from 'lucide-vue-next'
import { open } from '@tauri-apps/plugin-dialog'
import { convertFileSrc } from '@tauri-apps/api/core'
import { readFile } from '@tauri-apps/plugin-fs'
import { useConfirmToast } from '@/composables/useConfirmToast'
import AspectRatio from '@@materials/ui/aspect-ratio/AspectRatio.vue'
import { useSystemStore } from '@/stores'

const systemStore = useSystemStore()

defineProps<{
  systemInfo: SystemInfo
  disabled: boolean
}>()

const systemBackgroundImageSchema = toTypedSchema(
  z.object({
    backgroundImage: z.instanceof(File)
  })
)

const backgroundImageForm = useForm({
  validationSchema: systemBackgroundImageSchema
})

const isModalOpen = ref(false)

const newBackgroundImageUrl = ref<string | null>(null)

const selectImage = async () => {
  const filePath = await open({
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp'] }],
    multiple: false
  })
  if (typeof filePath !== 'string') return
  newBackgroundImageUrl.value = convertFileSrc(filePath)
  const fileBytes = await readFile(filePath)
  const fileName = filePath.split(/[\\/]/).pop() || 'image.png'
  const blob = new Blob([fileBytes], { type: 'image/png' })
  backgroundImageForm.setFieldValue(
    'backgroundImage',
    new File([blob], fileName, {
      type: blob.type
    })
  )
}

const onSubmit = backgroundImageForm.handleSubmit(async (values) => {
  await useConfirmToast(
    async () => {
      if (!values.backgroundImage) return
      await systemStore.updateDefaultBackgroundImage(values.backgroundImage)
    },
    {
      successTitle: 'Default background image updated successfully.',
      errorTitle: 'Failed to update default background image.'
    }
  )
  return true
})

watch(isModalOpen, (newVal) => {
  if (newVal === false) {
    newBackgroundImageUrl.value = null
    backgroundImageForm.resetForm()
  }
})
</script>
