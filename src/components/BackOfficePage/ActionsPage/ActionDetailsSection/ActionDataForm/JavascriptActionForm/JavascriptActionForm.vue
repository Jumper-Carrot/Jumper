<template>
  <ActionMainForm
    :actionsComposable="actionComposable"
    :cardOptions="options"
    :workspaces="workspaces"
    :tabs-triggers="[
      { label: 'Code', value: 'code' },
      { label: 'Options', value: 'options' }
    ]"
  >
    <TabsContent value="code" class="h-[calc(100%-8px)]">
      <JavascriptCodeEditor
        :actionComposable="actionComposable"
        :differentDataFields="differentDataFields"
        :options="options"
      />
    </TabsContent>
    <TabsContent value="options" class="h-[calc(100%-8px)]">
      <JavascriptOptionsEditor
        :actionComposable="actionComposable"
        :differentDataFields="differentDataFields"
        v-model:options="options"
    /></TabsContent>
  </ActionMainForm>
</template>

<script setup lang="ts">
import type { ActionsComposable } from '../../../useActions'
import type { Workspace } from '@@types'

import { watch } from 'vue'
import { useField } from 'vee-validate'

import { TabsContent } from '@@materials/ui/tabs'
import ActionMainForm from '../../ActionMainForm/ActionMainForm.vue'
import JavascriptCodeEditor from './JavascriptCodeEditor.vue'
import JavascriptOptionsEditor from './JavascriptOptionsEditor.vue'

defineProps<{
  actionComposable: ActionsComposable
  differentDataFields: string[]
  workspaces: Workspace[] | null
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
