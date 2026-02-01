<template>
  <div class="mt-4 flex items-center gap-0.5">
    <span
      class="pl-1 text-sm text-slate-800 italic dark:text-slate-400"
      v-if="props.actionDetailed.isPublic"
    >
      This action is Public
    </span>

    <div
      ref="containerRef"
      class="flex max-h-12 flex-wrap gap-1 overflow-hidden"
      v-else
    >
      <button
        class="rounded-md p-0.5 text-slate-500 transition-colors
          hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-800
          dark:hover:text-slate-100"
        title="View permissions"
        @click.prevent="isActionsUsersModalOpen = true"
      >
        <ScanEyeIcon :size="20" />
      </button>
      <ActionsUsersModal
        :action="props.actionDetailed"
        v-model:open="isActionsUsersModalOpen"
      />
      <template v-if="visibleCount !== null">
        <Badge
          v-for="(item, i) in permissions.slice(0, visibleCount)"
          :key="i"
          variant="outline"
          class="flex items-center gap-1 rounded-lg bg-slate-100 px-1.5 py-0.5
            text-xs text-slate-800 shadow-xs dark:bg-slate-800
            dark:text-slate-400"
        >
          <template v-if="'username' in item">
            <UserIcon :size="14" />
            {{ item.username }}
          </template>
          <template v-else-if="'isAdminGroup' in item">
            <UserCogIcon :size="14" />
            {{ item.name }}
          </template>
          <template v-else-if="'description' in item">
            <UsersIcon :size="14" />
            {{ item.name }}
          </template>
        </Badge>

        <Badge
          v-if="permissions.length > visibleCount"
          variant="outline"
          class="flex items-center gap-1 rounded-lg bg-slate-100 px-1.5 py-0.5
            text-xs text-slate-800 shadow-xs dark:bg-slate-800
            dark:text-slate-400"
        >
          + {{ permissions.length - visibleCount }} autres
        </Badge>
      </template>
    </div>

    <div
      ref="measureRef"
      class="pointer-events-none invisible absolute top-0 left-0 flex max-h-12
        flex-wrap gap-1 overflow-hidden"
      aria-hidden="true"
    >
      <Badge
        v-for="(item, i) in permissions"
        :key="i"
        class="flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-xs"
      >
        <template v-if="'username' in item">
          <UserIcon :size="14" />
          {{ item.username }}
        </template>
        <template v-else-if="'isAdminGroup' in item">
          <UserCogIcon :size="14" />
          {{ item.name }}
        </template>
        <template v-else-if="'description' in item">
          <UsersIcon :size="14" />
          {{ item.name }}
        </template>
      </Badge>
      <div
        ref="measureOverflowRef"
        class="flex items-center gap-1 rounded-lg px-1.5 py-0.5 text-xs"
      >
        <Badge style="display: none" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetailedAction } from '@@types'

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch
} from 'vue'
import { ScanEyeIcon, UserCogIcon, UserIcon, UsersIcon } from 'lucide-vue-next'

import { Badge } from '@@materials/ui/badge'
import ActionsUsersModal from './modals/ActionsUsersModal.vue'

const containerRef = ref<HTMLElement | null>(null)
const measureRef = ref<HTMLElement | null>(null)
const measureOverflowRef = useTemplateRef<HTMLElement>('measureOverflowRef')

const visibleCount = ref<number | null>(null)
const isActionsUsersModalOpen = ref(false)

const props = defineProps<{
  actionDetailed: DetailedAction
}>()

const permissions = computed(() => [
  ...props.actionDetailed.users,
  ...props.actionDetailed.groups,
  ...props.actionDetailed.roles
])

function debounce<T extends (...a: any[]) => void>(fn: T, wait = 80) {
  let t: number | undefined
  return (...args: Parameters<T>) => {
    window.clearTimeout(t)
    t = window.setTimeout(() => fn(...args), wait)
  }
}

const measure = async () => {
  if (props.actionDetailed.isPublic) {
    visibleCount.value = permissions.value.length
    return
  }

  await nextTick()
  await new Promise(requestAnimationFrame)

  const container = containerRef.value
  const m = measureRef.value
  const overflow = measureOverflowRef.value
  if (!container || !m || !overflow) return

  m.style.width = `${container.clientWidth}px`

  const total = permissions.value.length

  const children = Array.from(m.children).filter(
    c => c !== overflow
  ) as HTMLElement[]

  children.forEach(c => (c.style.display = ''))
  overflow.style.display = 'none'

  if (m.scrollHeight <= m.clientHeight) {
    visibleCount.value = total
    return
  }

  const fits = (count: number) => {
    children.forEach((c, i) => {
      c.style.display = i < count ? '' : 'none'
    })
    const hidden = total - count
    if (hidden > 0) {
      overflow.style.display = ''
      overflow.textContent = `+ ${hidden} autres`
    } else {
      overflow.style.display = 'none'
    }

    m.getBoundingClientRect()
    return m.scrollHeight <= m.clientHeight
  }

  let low = 0
  let high = total
  while (low < high) {
    const mid = Math.ceil((low + high) / 2)
    if (fits(mid)) {
      low = mid
    } else {
      high = mid - 1
    }
  }

  children.forEach(c => (c.style.display = ''))
  overflow.style.display = 'none'

  visibleCount.value = low
}

const debouncedMeasure = debounce(() => measure(), 60)

watch(
  () => permissions.value,
  () => {
    visibleCount.value = null
    measure()
  },
  { immediate: true, deep: true }
)

watch(
  () => props.actionDetailed.isPublic,
  v => {
    if (!v) measure()
    else visibleCount.value = permissions.value.length
  }
)

onMounted(() => {
  measure()
  window.addEventListener('resize', debouncedMeasure)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedMeasure)
})
</script>
