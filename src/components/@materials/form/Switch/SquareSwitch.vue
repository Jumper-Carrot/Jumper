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
        inline-flex h-[36px] w-[66px] shrink-0 cursor-pointer items-center
        rounded-lg border-2 border-transparent bg-slate-100 px-0.5
        transition-colors focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:outline-hidden disabled:cursor-not-allowed
        disabled:opacity-50`,
        props.class
      )
    "
  >
    <SwitchThumb
      :class="
        cn(
          `bg-background pointer-events-none block h-[30px] w-[30px] rounded-md
          shadow-lg ring-0 transition-transform
          data-[state=checked]:translate-x-[calc(100%-2px)]`
        )
      "
    >
      <slot name="thumb" />
    </SwitchThumb>
  </SwitchRoot>
</template>
