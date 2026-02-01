<template>
  <TooltipProvider class="flex">
    <Tooltip class="block">
      <TooltipTrigger as-child>
        <CircleHelp
          class="size-[13px] cursor-help text-slate-500 transition-colors
            hover:text-slate-800"
        />
      </TooltipTrigger>
      <TooltipContent side="right">
        <slot> Tooltip </slot>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { CircleHelp } from 'lucide-vue-next'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@@materials/ui/tooltip'
</script>
