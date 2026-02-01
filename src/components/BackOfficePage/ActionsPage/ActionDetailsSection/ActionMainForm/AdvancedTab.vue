<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-3">
      <Switch
        v-model="hasDelayBeforeRelaunch"
        class="h-5 w-[35px] rounded-full data-[state=checked]:bg-green-600
          data-[state=unchecked]:bg-slate-300
          dark:data-[state=unchecked]:bg-slate-500"
      >
        <template #thumb>
          <div
            class="flex h-full w-full items-center justify-center rounded-full"
          >
            <Check
              v-if="hasDelayBeforeRelaunch"
              class="size-3 text-green-600"
            />
            <div
              v-else
              class="size-2 rounded-xs bg-slate-400 dark:bg-slate-500"
            />
          </div>
        </template>
      </Switch>
      <span class="text-xs font-semibold text-slate-800 dark:text-slate-400"
        >Delay before relaunch</span
      >
    </div>
    <div class="mt-1 flex items-center">
      <InputField
        class="w-32 px-2"
        field-name="delayBeforeRelaunch"
        label="Delay (ms)"
        type="number"
        min="0"
        :disabled="!hasDelayBeforeRelaunch"
        :show-error-message="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { useField } from 'vee-validate'

import { InputField } from '@@materials/input'
import { Switch } from '@@materials/ui/switch'

const { value: hasDelayBeforeRelaunch } = useField<boolean>(
  'hasDelayBeforeRelaunch'
)
</script>
