<template>
  <ComboboxRoot
    v-model:open="open"
    :searchTerm="modelValue"
    class="w-full"
  >
    <ComboboxAnchor as-child>
      <ComboboxInput as-child>
        <slot :searchTerm="modelValue">
          <Input v-model="modelValue" />
        </slot>
      </ComboboxInput>
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent>
        <CommandList
          align="start"
          position="popper"
          class="z-50 mt-2 w-[150px] rounded-md bg-popover text-popover-foreground shadow-md
            outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
            data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <div v-if="loading" class="h-15 m-auto my-1 text-primary">
            <Loader2 class="m-auto h-12 animate-spin" />
          </div>
          <CommandGroup v-else>
            <slot name="search-list" :searchTerm="modelValue" :items="items">
              <CommandItem
                v-for="item in items"
                :key="getItemLabel(item)"
                :value="getItemLabel(item)"
                @select="
                  () => {
                    modelValue = getItemLabel(item)
                    open = false
                  }
                "
              >
                <slot name="list-item" :item="item" :label="getItemLabel(item)">
                  {{ getItemLabel(item) }}
                </slot>
              </CommandItem>
            </slot>
            <slot name="after-list" :searchTerm="modelValue" />
          </CommandGroup>
        </CommandList>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>

<script setup lang="ts" generic="T, U">
import { ref } from 'vue'
import { useItems } from '../useItems'

import { Loader2 } from 'lucide-vue-next'
import { CommandGroup, CommandItem, CommandList } from '@@materials/ui/command'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot
} from 'radix-vue'
import { Input } from '@@materials/form'

const modelValue = defineModel<any>()

const props = defineProps<{
  items: T[]
  label?: keyof T | ((item: T) => string)
  loading?: boolean

  placeholder?: string
  name: string
  description?: string
}>()

const open = ref(false)

const { getItemLabel } = useItems<T, U>(
  () => props.items,
  undefined,
  () => props.label
)
</script>
