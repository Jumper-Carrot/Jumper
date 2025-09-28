<template>
  <ActionMainForm
    :actionsComposable="actionComposable"
    :cardOptions="options"
    :tabs-triggers="[
      { label: 'Code', value: 'code' },
      { label: 'Options', value: 'options' }
    ]"
  >
    <TabsContent value="code" class="h-[calc(100%-8px)]">
      <PythonCodeEditor
        :actionComposable="actionComposable"
        :differentDataFields="differentDataFields"
        :options="options"
      />
    </TabsContent>
    <TabsContent value="options" class="h-[calc(100%-8px)]">
      <PythonOptionsEditor
        :actionComposable="actionComposable"
        :differentDataFields="differentDataFields"
        v-model:options="options"
    /></TabsContent>
  </ActionMainForm>
</template>

<script setup lang="ts">
import { watch } from 'vue'

import type { ActionsComposable } from '../../../useActions'
import { useField } from 'vee-validate'

import { TabsContent } from '@@materials/ui/tabs'
import PythonCodeEditor from './PythonCodeEditor.vue'
import PythonOptionsEditor from './PythonOptionsEditor.vue'
import ActionMainForm from '../../ActionMainForm/ActionMainForm.vue'

defineProps<{
  actionComposable: ActionsComposable
  differentDataFields: string[]
}>()

const options = defineModel<string[] | null>('options', {
  default: null
})

const { value: useCombobox } = useField<string>('data.useCombobox')

watch(useCombobox, () => {
  if (!useCombobox.value) {
    options.value = null
  }
})
</script>
