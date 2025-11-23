<template>
  <ThemingBar />
  <div
    class="h-full overflow-auto bg-cover bg-center"
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
            v-if="isManySections"
            class="border-secondary border-b text-sm font-semibold text-slate-400 italic dark:text-slate-300"
          >
            {{ sectionName }}
          </h2>
          <div class="flex flex-wrap justify-start gap-4 p-4 px-3">
            <div
              v-for="action in actionsBySection[sectionName]"
              :key="action.id"
              class="relative"
            >
              <ActionCard
                class="h-[145px] w-[130px]"
                :action="action"
                :readonly="isThemingBarOpen"
              />
              <!-- <HideActionButton v-if="isThemingBarOpen" /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex h-full items-center justify-center">
      <Loader2 class="text-muted-foreground h-8 w-8 animate-spin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayableAction } from '@@types'

import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import jumper from '@/services/jumper'
import {
  useAuthUserStore,
  useSystemStore,
  useTitleBarOptionsStore
} from '@/stores'
import { useQuery } from '@/composables'

import ActionCard from './ActionCard.vue'
import ThemingBar from './ThemingBar.vue'

// import HideActionButton from './HideActionButton.vue'
const { systemInfo } = storeToRefs(useSystemStore())
const { search, isThemingBarOpen } = storeToRefs(useTitleBarOptionsStore())
const { user } = storeToRefs(useAuthUserStore())

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

const actionsBySection = computed(() => {
  const sections: Record<string, PlayableAction[]> = {}
  actions.value?.forEach(action => {
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

const isManySections = computed(() => {
  return (
    Object.keys(actionsBySection.value).length > 1 ||
    Object.keys(actionsBySection.value)[0] !== 'Others'
  )
})

const orderedSections = computed(() => {
  const sections = Object.keys(actionsBySection.value)
  sections.sort((a, b) => {
    if (sections.includes('Others')) {
      return sections.indexOf('Others') === 0 ? -1 : 1
    }
    return a.localeCompare(b)
  })
  return sections
})
</script>
