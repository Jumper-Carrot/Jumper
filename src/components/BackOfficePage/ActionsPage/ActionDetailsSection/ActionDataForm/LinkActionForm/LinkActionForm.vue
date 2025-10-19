<template>
  <ActionMainForm
    :actionsComposable="actionComposable"
    :cardOptions="options"
    :workspaces="workspaces"
  >
    <template #action-tab>
      <InputField
        field-name="data.url"
        label="URL"
        placeholder="https://example.com"
        :class="{
          'bg-yellow-100': differentDataFields.includes('url')
        }"
        :show-error-message="false"
        class="mb-4 max-w-[600px]"
      />
    </template>
  </ActionMainForm>
</template>

<script setup lang="ts">
import type { Workspace } from '@@types'
import type { ActionsComposable } from '../../../useActions'
import InputField from '@@materials/input/InputField.vue'
import ActionMainForm from '../../ActionMainForm/ActionMainForm.vue'

const options = defineModel<string[] | null>('options', {
  default: null
})
options.value = null

defineProps<{
  actionComposable: ActionsComposable
  differentDataFields: string[]
  workspaces: Workspace[] | null
}>()
</script>
