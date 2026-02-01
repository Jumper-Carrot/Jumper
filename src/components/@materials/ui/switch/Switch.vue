<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import {
  SwitchRoot,
  type SwitchRootEmits,
  type SwitchRootProps,
  SwitchThumb,
  useForwardPropsEmits
} from 'reka-ui'

import { cn } from '@/services/utils'

const props = defineProps<
  SwitchRootProps & { class?: HTMLAttributes['class'] }
>()

const emits = defineEmits<SwitchRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :class="
      cn(
        `peer focus-visible:ring-ring focus-visible:ring-offset-background
        data-[state=checked]:bg-primary data-[state=unchecked]:bg-input
        inline-flex h-5 w-[35px] shrink-0 cursor-pointer items-center
        rounded-full border-2 border-transparent transition-colors
        focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:outline-hidden disabled:cursor-not-allowed
        disabled:opacity-50`,
        props.class
      )
    "
  >
    <SwitchThumb
      :class="
        cn(
          `bg-background pointer-events-none block h-4 w-4 rounded-full
          shadow-lg ring-0 transition-transform
          data-[state=checked]:translate-x-[calc(100%-1px)]`
        )
      "
    >
      <slot name="thumb" />
    </SwitchThumb>
  </SwitchRoot>
</template>
