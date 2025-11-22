<script setup lang="ts">
import { cn } from '@/services/utils'
import {
  SwitchRoot,
  type SwitchRootEmits,
  type SwitchRootProps,
  SwitchThumb,
  useForwardPropsEmits
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

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
        `peer inline-flex h-[36px] w-[66px] shrink-0 cursor-pointer items-center rounded-lg
        border-2 border-transparent transition-colors focus-visible:outline-hidden
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        focus-visible:ring-offset-background disabled:cursor-not-allowed px-0.5
        disabled:opacity-50
        bg-slate-100`,
        props.class
      )
    "
  >
    <SwitchThumb
      :class="
        cn(
          `pointer-events-none block h-[30px] w-[30px] rounded-md bg-background shadow-lg ring-0
          transition-transform data-[state=checked]:translate-x-[calc(100%-2px)]`
        )
      "
    >
      <slot name="thumb" />
    </SwitchThumb>
  </SwitchRoot>
</template>
