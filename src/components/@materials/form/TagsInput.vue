<template>
  <TagsInput class="max-h-[500px]">
    <div v-if="icon" class="relative w-6 max-w-sm items-center">
      <span
        class="absolute inset-y-0 start-0 flex h-full items-center justify-center"
      >
        <slot name="icon">
          <Tags class="size-6 text-muted-foreground text-slate-400" />
        </slot>
      </span>
    </div>
    <TagsInputItem
      v-for="(item, i) in tags"
      class="rounded-lg bg-white text-slate-800 shadow-xs dark:text-slate-300"
      :key="JSON.stringify(item)"
      :value="item"
    >
      <slot :item="item">
        <TagsInputItemText />
      </slot>
      <TagsInputItemDelete
        @click="removeTag(i)"
        class="transition-colors hover:bg-slate-200"
      />
    </TagsInputItem>
    <ComboboxRoot
      v-model:open="open"
      v-model:search-term="searchTerm"
      class="grow"
    >
      <ComboboxAnchor as-child>
        <ComboboxInput as-child class="w-full">
          <TagsInputInput
            class="text-md max-w-full px-0 placeholder:text-muted-foreground"
            :placeholder="placeholder"
            @keyup.enter="!disableKeyEnter && addTag(searchTerm)"
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
            class="z-50 mt-2 max-h-[150px] w-[150px] rounded-md bg-popover text-popover-foreground
              shadow-md outline-hidden data-[state=open]:animate-in
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0
              data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95
              data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
              data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
              data-[side=top]:slide-in-from-bottom-2"
          >
            <slot
              name="search-list"
              :searchTerm="searchTerm"
              :items="tags"
              :addTag="addTag"
            />
          </CommandList>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </TagsInput>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tags } from 'lucide-vue-next'
import { CommandList } from '@@materials/ui/command'
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

withDefaults(
  defineProps<{
    icon?: boolean
    create?: boolean
    placeholder?: string
    disableKeyEnter?: boolean
  }>(),
  {
    icon: true,
    create: false
  }
)

const emits = defineEmits<{
  'press-enter': [tag: string, exist: boolean]
}>()

const open = ref(false)

const searchTerm = defineModel<string>('search-term')
const tags = defineModel<any[]>('tags', {
  default: () => []
})

const addTag = (tag: any) => {
  if (!tag) {
    emits('press-enter', tag, false)
  }
  tags.value.push(tag)
  searchTerm.value = ''
  emits('press-enter', tag, true)
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
}
</script>
