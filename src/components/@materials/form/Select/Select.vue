<template>
  <Popover v-model:open="open" by="label">
    <PopoverTrigger as-child>
      <Button
        ref="triggerRef"
        variant="outline"
        role="combobox"
        :class="cn(selectVariants({ variant, size }), props.class)"
      >
        <div class="flex grow items-center gap-2 truncate text-start">
          <slot
            name="selection"
            :item="modelValue && getItem(modelValue)"
            :label="modelValue && getLabelFromKey(modelValue)"
          >
            {{
              (modelValue && getLabelFromKey(modelValue)) ||
              getItemLabel(modelValue as any)
            }}
            <span
              v-if="!modelValue && placeholder"
              class="text-muted-foreground"
              >{{ placeholder }}</span
            >
          </slot>
        </div>
        <Button
          class="z-1000 -mr-1 ml-1 h-4 w-4 shrink-0 rounded-full p-0 opacity-50
            hover:bg-slate-300 hover:opacity-70"
          v-if="modelValue && clear"
          variant="ghost"
          @click.stop="
            () => {
              modelValue = null
            }
          "
        >
          <X />
        </Button>
        <ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="min-w-[50px] p-0"
      :style="{ width: `${width + 22}px` }"
    >
      <Command v-model:searchTerm="searchTerm" :filterFunction="filterItems">
        <CommandInput v-if="search" placeholder="Search..." class="h-9" />
        <template v-if="!loading">
          <CommandEmpty class="flex flex-col items-center gap-2">
            <p>No item found.</p>
          </CommandEmpty>
          <CommandList :class="cn(commandListClass)">
            <CommandGroup>
              <CommandItem
                v-for="item in items"
                :key="JSON.stringify(getItemKey(item))"
                :value="JSON.stringify(getItemKey(item))"
                @select="
                  () => {
                    modelValue = getItemKey(item)
                    open = false
                  }
                "
              >
                <div
                  class="mr-auto flex grow items-center gap-2 truncate text-start"
                >
                  <slot
                    name="list-item"
                    :item="item"
                    :label="getItemLabel(item)"
                  >
                    {{ getItemLabel(item) }}
                  </slot>
                </div>
                <div class="w-[23px] shrink-0">
                  <Check
                    v-if="
                      JSON.stringify(modelValue) ==
                      JSON.stringify(getItemKey(item))
                    "
                    class="ml-auto h-4 w-4"
                  />
                </div>
              </CommandItem>
              <slot name="end-list" :searchTerm="searchTerm" />
            </CommandGroup>
          </CommandList>
        </template>
        <div v-else class="h-15 m-auto my-1 w-[150px] text-primary">
          <Loader2 class="m-auto h-12 animate-spin" />
        </div>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts" generic="T, U">
import { ref, type HTMLAttributes } from 'vue'
import { useElementSize } from '@vueuse/core'
import { cn } from '@/services/utils'
import { type SelectVariants, selectVariants } from '.'

import { Check, ChevronDown, X, Loader2 } from 'lucide-vue-next'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@@materials/ui/command'
import { Button } from '@@materials/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@@materials/ui/popover'
import { useItems } from '../useItems'

const modelValue = defineModel<U | null>('modelValue', {
  default: null
})

const props = defineProps<{
  items: T[]
  itemKey?: keyof T | ((item: T) => U)
  label?: keyof T | ((item: T) => string)
  placeholder?: string
  search?: boolean
  searchField?: keyof T | ((item: T) => string)
  clear?: boolean
  loading?: boolean
  class?: HTMLAttributes['class']
  variant?: SelectVariants['variant']
  size?: SelectVariants['size']
  commandListClass?: HTMLAttributes['class']
}>()

const triggerRef = ref<HTMLElement | null>(null)
const searchTerm = defineModel<string>('searchTerm', {
  default: ''
})
const open = ref(false)

const { width } = useElementSize(triggerRef)
const { getItemKey, getItemLabel, getItem, getLabelFromKey } = useItems<T, U>(
  () => props.items,
  () => props.itemKey,
  () => props.label
)

const filterItems = (
  vals: string[] | number[] | false[] | true[] | Record<string, any>[],
  term: string
) => {
  if (!term) return vals
  const lowerTerm = term.toLowerCase()
  return props.items
    .filter((item) => getItemLabel(item)?.toLowerCase().includes(lowerTerm))
    .map((item) => JSON.stringify(getItemKey(item))) as typeof vals
}
</script>
