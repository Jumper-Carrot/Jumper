<template>
  <ThemingBar />
  <div
    class="h-full overflow-auto bg-cover bg-center"
    v-if="user"
    :style="{
      backgroundImage: backgroundImage
    }"
  >
    <div class="flex flex-col justify-center gap-4 p-4" v-if="isFetched">
      <div
        v-for="sectionName in orderedSections"
        :key="sectionName"
        class="w-full"
      >
        <div class="mb-2 px-2">
          <h2
            v-if="isMultiSections"
            class="border-secondary border-b text-sm font-semibold
              text-slate-400 italic dark:text-slate-300"
          >
            {{ sectionName }}
          </h2>
          <draggable
            class="flex flex-wrap p-4 px-3"
            :class="[isMultiSections ? 'justify-start' : 'justify-center']"
            :list="visibleActionsBySection[sectionName]"
            :group="sectionName"
            item-key="id"
            :move="(evt: any) => isThemingBarOpen && evt.to === evt.from"
            :disabled="!isThemingBarOpen"
            ghost-class="drag-ghost"
            chosen-class="drag-chosen"
            @start="onDragStart"
            @end="onDragEnd()"
          >
            <template #item="{ element: action }">
              <div
                class="relative transition-all"
                :key="action.id"
                :class="{
                  'cursor-grab': isThemingBarOpen && !grabbing
                }"
              >
                <ActionCard
                  class="m-2 h-[145px] w-[130px]"
                  :action="action"
                  :readonly="isThemingBarOpen"
                  :force-show="isThemingBarOpen"
                  @hover-change="
                    (isHover: boolean) => {
                      if (action.description.length == 0) return
                      isActionHovered = isHover
                      if (isHover) lastHoveredAction = action
                    }
                  "
                />
                <HideActionButton
                  v-if="isThemingBarOpen && systemInfo?.allowUsersToHideActions"
                  :action-id="action.id"
                  v-model:userPreferences="user.preferences"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <div v-else class="flex h-full items-center justify-center">
      <Loader2 class="text-muted-foreground h-8 w-8 animate-spin" />
    </div>
    <DescriptionInfoCard
      v-if="
        systemInfo?.allowShowingDescription &&
        user?.preferences.allowShowingDescription
      "
      :class="[
        isActionHovered ? 'right-4 opacity-100' : '-right-4 opacity-0 delay-200'
      ]"
      :action="lastHoveredAction"
    />
  </div>
</template>

<script setup lang="ts">
import type { PlayableAction } from '@@types'

import { computed, ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'

import jumper from '@/services/jumper'
import {
  useAuthUserStore,
  useSystemStore,
  useTitleBarOptionsStore
} from '@/stores'
import { useQuery } from '@/composables'

import ActionCard from './ActionCard.vue'
import DescriptionInfoCard from './DescriptionInfoCard.vue'
import HideActionButton from './HideActionButton.vue'
import ThemingBar from './ThemingBar.vue'

const authUserStore = useAuthUserStore()

const grabbing = ref(false)
function onDragEnd() {
  const allOrderedIds: number[] = []
  Object.values(visibleActionsBySection.value).forEach(actions => {
    actions.forEach(a => allOrderedIds.push(a.id))
  })
  if (user.value?.preferences) {
    user.value.preferences.customOrder = allOrderedIds
    authUserStore.updateUserPreferences({ customOrder: allOrderedIds })
  }
  grabbing.value = false
}

const { systemInfo } = storeToRefs(useSystemStore())
const { search, isThemingBarOpen } = storeToRefs(useTitleBarOptionsStore())
const { user } = storeToRefs(useAuthUserStore())

const isActionHovered = ref(false)
const lastHoveredAction = ref<PlayableAction | null>(null)

const backgroundImage = computed(() => {
  if (!systemInfo.value?.allowBackgroundImage) return 'none'
  const defaultBackgroundUrl = user?.value?.preferences
    .disableDefaultBackgroundImage
    ? 'none'
    : `url(${systemInfo.value?.defaultBackgroundImageUrl})`

  return user?.value?.preferences.customBackgroundImageUrl
    ? `url(${user.value.preferences.customBackgroundImageUrl})`
    : defaultBackgroundUrl
})

const { data: actions, isFetched } = useQuery<PlayableAction[]>(
  ['playable-actions', search],
  () => {
    return jumper.actions.getMyActions({ search: search.value })
  }
)

// Utility to check if an action is hidden for the current user
const isActionHidden = (action: PlayableAction): boolean => {
  return Boolean(
    user.value &&
      systemInfo.value?.allowUsersToHideActions &&
      user.value.preferences.hiddenActions.includes(action.id)
  )
}

function onDragStart() {
  document.body.classList.add('dragging')
}

const actionsBySection = computed(() => {
  const sections: Record<string, PlayableAction[]> = {}
  if (!actions.value) return sections
  const customOrder = user.value?.preferences?.customOrder || []
  const actionsSorted = [...actions.value]
  actionsSorted.sort((a, b) => {
    const ia = customOrder.indexOf(a.id)
    const ib = customOrder.indexOf(b.id)
    if (ia === -1 && ib === -1) {
      return a.name.localeCompare(b.name)
    }
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })
  actionsSorted.forEach(action => {
    let section = 'Others'
    if (systemInfo.value?.allowActionSections && action.section) {
      section = action.section
    }
    if (!sections[section]) {
      sections[section] = []
    }
    sections[section].push(action)
  })
  return sections
})

// Only show non-hidden actions unless theming bar is open
const visibleActionsBySection = computed(() => {
  const result: Record<string, PlayableAction[]> = {}
  Object.entries(actionsBySection.value).forEach(([section, actions]) => {
    if (isThemingBarOpen.value) {
      result[section] = actions
    } else {
      const visible = actions.filter(a => !isActionHidden(a))
      if (visible.length > 0) {
        result[section] = visible
      }
    }
  })
  return result
})

const isMultiSections = computed(() => {
  const keys = Object.keys(visibleActionsBySection.value)
  if (keys.length === 0) return false
  return keys.length > 1 || keys[0] !== 'Others'
})

const orderedSections = computed(() => {
  const sections = Object.keys(visibleActionsBySection.value)
  sections.sort((a, b) => {
    if (sections.includes('Others')) {
      return sections.indexOf('Others') === 0 ? -1 : 1
    }
    return a.localeCompare(b)
  })
  return sections
})
</script>

<style scoped>
.drag-ghost {
  opacity: 0;
  pointer-events: none;
}
.drag-chosen {
  transform: scale(1.05);
  transition: all 0.2s;
  z-index: 20;
}

.dragging,
.dragging * {
  cursor: grabbing !important;
}
</style>
