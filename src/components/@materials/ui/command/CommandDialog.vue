<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'radix-vue'

import { useForwardPropsEmits } from 'radix-vue'

import { Dialog, DialogContent } from '@/components/@materials/ui/dialog'
import Command from './Command.vue'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <Dialog v-bind="forwarded">
    <DialogContent class="overflow-hidden p-0 shadow-lg">
      <Command
        class="**:[[cmdk-group-heading]]:text-muted-foreground
          [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0
          [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5
          [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5
          **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium
          **:[[cmdk-group]]:px-2 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-2
          **:[[cmdk-item]]:py-3"
      >
        <slot />
      </Command>
    </DialogContent>
  </Dialog>
</template>
