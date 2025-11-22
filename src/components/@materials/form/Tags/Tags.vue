<template>
  <TagsInput
    :class="cn('relative', tagsVariants({ variant, size }), props.class)"
    v-model="tags"
  >
    <div v-if="!noIcon" :class="cn(tagIconVariants({ variant, size }))">
      <slot name="icon">
        <Tags />
      </slot>
    </div>
    <Draggable
      v-model="tags"
      item-key="id"
      class="flex flex-wrap gap-2"
      @start="drag = true"
      @end="drag = false"
      handle=".handle"
      v-bind="dragOptions"
    >
      <template #item="{ element }">
        <TagsInputItem
          :class="
            cn(tagVariants({ variant, size })) + (draggable ? ' handle' : '')
          "
          :key="JSON.stringify(element)"
          :value="element"
        >
          <slot :item="element" :label="getItemLabel(element)">
            <TagsInputItemText v-text="getItemLabel(element)" />
          </slot>
          <TagsInputItemDelete class="transition-colors hover:bg-slate-200" />
        </TagsInputItem>
      </template>
    </Draggable>
    <ComboboxRoot
      v-model:open="open"
      v-model:search-term="searchTerm"
      class="grow"
    >
      <ComboboxAnchor as-child>
        <ComboboxInput as-child>
          <TagsInputInput
            class="text-md max-w-full px-0 placeholder:text-muted-foreground"
            :placeholder="placeholder"
            aria-disabled="true"
            @keydown.enter.prevent="!noKeyEnter && addTag(searchTerm)"
            @focus="open = true"
          />
        </ComboboxInput>
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent>
          <CommandList
            side="bottom"
            align="start"
            position="popper"
            class="z-50 mt-2 max-h-[200px] max-w-full rounded-md bg-popover text-popover-foreground
              shadow-md outline-hidden data-[state=open]:animate-in
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0
              data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95
              data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
              data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
              data-[side=top]:slide-in-from-bottom-2"
          >
            <div v-if="loading" class="h-15 m-auto my-1 w-[150px] text-primary">
              <Loader2 class="m-auto h-12 animate-spin" />
            </div>
            <slot
              v-else
              name="search-list"
              :searchTerm="searchTerm"
              :items="tags"
              :addTag="addTag"
            >
              <CommandItem
                v-for="item in items.filter(
                  (item) =>
                    !tags.find(
                      (tag) => JSON.stringify(tag) === JSON.stringify(item)
                    )
                )"
                :key="JSON.stringify(item)"
                :value="JSON.stringify(item)"
                @select.prevent="addTag(item)"
                class="flex font-semibold text-slate-700"
              >
                <slot name="list-item" :item="item" :label="getItemLabel(item)">
                  {{ getItemLabel(item) }}
                </slot>
              </CommandItem>
            </slot>
            <slot name="after-list" :searchTerm="searchTerm" :addTag="addTag" />
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>

<script setup lang="ts" generic="T, U">
import { type HTMLAttributes, ref } from 'vue'
import Draggable from 'vuedraggable'
import { cn } from '@/services/utils'
import {
  tagIconVariants,
  type TagsVariants,
  tagsVariants,
  tagVariants
} from '.'
import { Tags, Loader2 } from 'lucide-vue-next'
import { CommandList, CommandItem } from '@@materials/ui/command'
import { useItems } from '../useItems'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@@materials/ui/tags-input'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot
} from 'radix-vue'

const searchTerm = defineModel<string>('search-term')
const tags = defineModel<any[]>({
  default: () => []
})

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  items: T[]
  label?: keyof T | ((item: T) => string)

  loading?: boolean
  noIcon?: boolean
  placeholder?: string
  noKeyEnter?: boolean

  class?: HTMLAttributes['class']
  variant?: TagsVariants['variant']
  size?: TagsVariants['size']
  draggable?: boolean
}>()

const emits = defineEmits<{
  'tag-added': [tag: string, exist: boolean]
}>()

const open = ref(false)
const drag = ref<boolean>(false)
const dragOptions = {
  animation: 250,
  group: 'people',
  disabled: false,
  ghostClass: 'ghost'
}

const { getItemLabel } = useItems<T, U>(
  () => props.items,
  undefined,
  () => props.label
)

const addTag = (tag: any) => {
  if (!tag) {
    emits('tag-added', tag, false)
    return
  }
  tags.value = [...tags.value, tag]
  searchTerm.value = ''
  emits('tag-added', tag, true)
}
</script>
