<template>
  <div class="flex h-full flex-col gap-2 overflow-auto">
    <Label>Code</Label>
    <CodeEditor
      class="min-h-0 flex-1"
      v-model="code"
      mode="python"
      language="python"
      :isDiff="differentDataFields.includes('code')"
      :compareCode="(actionDetailed?.data as PythonActionData).code"
      :namespace="actionDetailed?.name + ' - Test'"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import type { PythonActionData } from '@@types'
import type { ActionsComposable } from '../../../useActions'
import CodeEditor from '../CodeEditor/CodeEditor.vue'
import { Label } from '@@materials/ui/label'

const props = defineProps<{
  actionComposable: ActionsComposable
  differentDataFields: string[]
  options: string[] | null
}>()

const { value: code } = useField<string>('data.code')

const { actionDetailed } = props.actionComposable
</script>
