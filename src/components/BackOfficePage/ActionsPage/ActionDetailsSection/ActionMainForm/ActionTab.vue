<template>
  <div class="flex w-full flex-col gap-3 pb-4" v-if="actionDetailed">
    <div class="flex w-full gap-3">
      <div class="ml-1 flex w-full flex-col gap-2">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1 pl-1 text-sm">
            <p class="font-semibold">Type :</p>
            <Badge
              variant="outline"
              class="ml-1 flex items-center gap-1 rounded-md border-none bg-slate-100 px-2 py-1
                text-sm shadow-sm dark:bg-slate-800"
            >
              <div
                class="flex h-4 w-4 flex-shrink-0 items-center justify-center"
                :title="actionDetailed.data.type"
              >
                <Link v-if="actionDetailed.data.type == 'Link'" :size="12" />
                <img
                  v-else-if="actionDetailed.data.type == 'Python'"
                  src="/actions/python.png"
                />
                <img v-else src="/actions/windows-cmd.png" />
              </div>
              {{ actionDetailed.data.type }}
            </Badge>
          </div>
          <Switch
            class="ml-auto h-[20px] w-[35px] rounded-full data-[state=checked]:bg-green-600
              data-[state=unchecked]:bg-slate-300 dark:data-[state=unchecked]:bg-slate-500"
            v-model="isActive"
          >
            <template #thumb>
              <div
                class="flex h-full w-full items-center justify-center rounded-full"
              >
                <Check v-if="isActive" class="size-3 text-green-600" />
                <div
                  v-else
                  class="size-2 rounded-[2px] bg-slate-400 dark:bg-slate-500"
                />
              </div>
            </template>
          </Switch>
        </div>
        <div
          class="flex w-full items-start justify-between gap-4 max-lg:flex-col-reverse"
        >
          <div class="flex w-full max-w-[calc(100%-100px)] flex-col gap-3">
            <InputField
              class="max-w-[600px] px-2"
              field-name="name"
              label="Name"
              maxlength="25"
              :show-error-message="false"
            />
            <TextareaField
              class="max-h-[60px] min-h-[60px] max-w-[600px] resize-none px-2 py-1"
              field-name="description"
              label="Description"
              maxlength="500"
              :show-error-message="false"
            />
            <InputField
              v-if="systemInfo?.allowActionSections"
              class="max-w-[600px] px-2"
              field-name="section"
              label="Section"
              maxlength="25"
              :show-error-message="false"
            />
            <SelectField
              v-if="workspaces"
              class="max-w-[600px] px-2 py-1 shadow-none"
              size="sm"
              fieldName="workspace"
              field-label="Workspace"
              :show-error-message="false"
              label="label"
              itemKey="value"
              :items="[
                { label: 'None', value: null },
                ...workspaces.map((ws) => ({
                  label: ws.name,
                  value: ws.id
                }))
              ]"
            />
            <div class="flex flex-col gap-1">
              <PermissionTagsField v-if="!isPublic" field-name="permissions" />
              <div class="flex items-center gap-[2px]">
                <div class="pl-1">
                  <CheckboxField
                    class="h-[13px] w-[13px]"
                    field-name="isPublic"
                    :show-error-message="false"
                  />
                </div>
                <span
                  class="text-xs font-semibold text-slate-800 dark:text-slate-400"
                >
                  Public
                </span>
              </div>
            </div>
            <slot />
          </div>
          <div
            class="group relative flex h-[78px] w-[78px] flex-shrink-0 flex-col items-center gap-2
              rounded-md border-slate-300 bg-slate-100 hover:cursor-pointer
              hover:border-slate-400 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <button
              @click.prevent="() => open()"
              class="h-full w-full flex-shrink-0"
            >
              <div
                class="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center
                  rounded-md bg-black text-center text-sm text-white opacity-0 transition-all
                  group-hover:opacity-50"
              >
                <ImagePlus class="size-6" />
              </div>
              <img
                v-if="thumbnailUrl || actionDetailed?.thumbnailUrl"
                :src="thumbnailUrl || actionDetailed?.thumbnailUrl"
                class="h-full w-full rounded-md object-contain"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center"
              >
                <Carrot :size="60" class="mb-2 ml-2 text-slate-300" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Workspace } from '@@types'
import { useField } from 'vee-validate'
import { useFileDialog } from '@vueuse/core'
import { Switch } from '@@materials/ui/switch'
import type { ActionsComposable } from '../../useActions'
import { useToast } from '@@materials/ui/toast'
import PermissionTagsField from '@/components/BackOfficePage/@common/PermissionTagsField.vue'
import { InputField, TextareaField, CheckboxField } from '@@materials/input'
import { SelectField } from '@@materials/form'
import { Badge } from '@@materials/ui/badge'
import { Check, Link, Carrot, ImagePlus } from 'lucide-vue-next'
import { useSystemStore } from '@/stores/systemStore'
import { storeToRefs } from 'pinia'

const { systemInfo } = storeToRefs(useSystemStore())

const props = defineProps<{
  actionsComposable: ActionsComposable
  cardOptions?: string[] | null
  workspaces?: Workspace[] | null
}>()

const { actionDetailed } = props.actionsComposable
const { value: isPublic } = useField<boolean>('isPublic')
const { value: isActive } = useField<boolean>('isActive')
const { value: thumbnailUrl } = useField<string | null>('thumbnailUrl')

const { open, onChange } = useFileDialog({
  multiple: false,
  accept: 'image/*'
})

const { toast } = useToast()

onChange(async (files) => {
  if (files && files.length > 0 && actionDetailed.value) {
    const file = files[0]
    try {
      thumbnailUrl.value = await props.actionsComposable.updateThumbnail(
        actionDetailed.value.id,
        file
      )
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Failed to update thumbnail.',
          description: error.message,
          variant: 'destructive'
        })
      }
    }
  }
})
</script>
