<template>
  <div class="flex h-full flex-col gap-4 overflow-auto">
    <CheckboxField
      fieldName="data.useCombobox"
      label="Use combobox"
      :showErrorMessage="false"
    />
    <div v-if="useCombobox" class="flex min-h-0 flex-1 flex-col gap-2">
      <Label>Combobox Code</Label>
      <CodeEditor
        class="min-h-0 flex-1"
        v-model="comboboxCode"
        mode="get-options"
        language="python"
        :namespace="actionDetailed?.name + ' - Combobox'"
        @update:resultOptions="
          newOptions => {
            options = useCombobox ? newOptions : null
          }
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActionsComposable } from '../../../useActions'

import { useField } from 'vee-validate'

import { CheckboxField } from '@@materials/input'
import { Label } from '@@materials/ui/label'
import CodeEditor from '../CodeEditor/CodeEditor.vue'

const props = defineProps<{
  actionComposable: ActionsComposable
}>()

const options = defineModel<string[] | null>('options', {
  default: null
})

const { value: useCombobox } = useField<string>('data.useCombobox')
const { value: comboboxCode } = useField<string>('data.comboboxCode')
const { actionDetailed } = props.actionComposable
</script>
