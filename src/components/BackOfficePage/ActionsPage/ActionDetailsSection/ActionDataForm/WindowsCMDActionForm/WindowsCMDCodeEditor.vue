<template>
  <div class="flex h-full flex-col gap-2 overflow-auto">
    <Label>Code</Label>
    <CodeEditor
      class="min-h-0 flex-1"
      v-model="code"
      mode="cmd"
      language="cmd"
      :isDiff="differentDataFields.includes('code')"
      :compareCode="(actionDetailed?.data as WindowsCMDActionData).code"
      :namespace="actionDetailed?.name + ' - Test'"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
import type { ActionsComposable } from '../../../useActions'
import type { WindowsCMDActionData } from '@@types'

import { useField } from 'vee-validate'

import { Label } from '@@materials/ui/label'
import CodeEditor from '../CodeEditor/CodeEditor.vue'

const props = defineProps<{
  actionComposable: ActionsComposable
  differentDataFields: string[]
  options: string[] | null
}>()

const { value: code } = useField<string>('data.code')

const { actionDetailed } = props.actionComposable
</script>
