<template>
  <BackOfficePageLayout>
    <form @submit="onSubmit" class="h-full">
      <div class="flex h-full flex-col" v-if="actionDetailed">
        <ActionHeaderForm
          :actionsComposable="actionsComposable"
          v-model:isVersionBarOpen="isVersionBarOpen"
          :cardOptions="cardOptions"
          :workspaces="workspaces?.results || null"
        />
        <div class="relative flex h-full overflow-hidden">
          <div
            class="relative flex h-full grow flex-col transition-all ease-in-out"
            :class="[isVersionBarOpen ? 'md:mr-[244px]' : 'md:mr-0']"
          >
            <div class="mt-4 flex h-full w-full flex-col gap-2 overflow-hidden">
              <component
                :is="ACTION_DATA_COMPONENTS[actionDetailed.data.type]"
                :actionComposable="actionsComposable"
                :differentDataFields="differentDataFields"
                :workspaces="workspaces?.results || null"
                v-model:options="cardOptions"
              />
            </div>
            <div
              class="flex w-full shrink-0 items-end justify-end gap-2 border-t"
            >
              <div class="mr-auto">
                <DeleteActionButton
                  class="mr-auto"
                  :actionsComposable="actionsComposable"
                />
              </div>
              <Button
                size="sm"
                class="mt-2"
                :disabled="!meta.dirty || !meta.valid"
              >
                <Save />
                Save
              </Button>
            </div>
          </div>
          <transition name="slide-right">
            <ActionDetailsVersionsBar
              v-if="isVersionBarOpen"
              class="absolute right-0 transform"
              :versionsComposable="versionsComposable"
            />
          </transition>
        </div>
      </div>
      <div v-else class="flex h-full w-full items-center justify-center">
        <Loader2 class="animate-spin text-slate-500 size-8" />
      </div>
    </form>
  </BackOfficePageLayout>
</template>

<script setup lang="ts">
import type { ActionsComposable } from '../useActions'

import { ref, watch } from 'vue'
import { Loader2, Save } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import jumper from '@/services/jumper'
import { useSystemStore } from '@/stores'
import { useQuery } from '@/composables'

import Button from '@@materials/ui/button/Button.vue'
import BackOfficePageLayout from '../../@common/BackOfficePageLayout.vue'
import { ACTION_DATA_COMPONENTS } from './ActionDataForm'
import ActionDetailsVersionsBar from './ActionDetailsVersionsBar.vue'
import ActionHeaderForm from './ActionMainForm/ActionHeaderForm.vue'
import DeleteActionButton from './DeleteActionButton.vue'
import { useActionDetailedForm } from './useActionDetailedForm'
import { useVersions } from './useVersions'

const systemStore = useSystemStore()

const props = defineProps<{
  actionsComposable: ActionsComposable
}>()
const { actionDetailed } = props.actionsComposable
const form = useActionDetailedForm(actionDetailed)
const { handleSubmit, meta } = form

const isVersionBarOpen = ref(false)

const versionsComposable = useVersions(isVersionBarOpen, actionDetailed, form)
const { differentDataFields, versionsQuery } = versionsComposable
const cardOptions = ref<string[] | null>([])

watch(
  () => actionDetailed.value,
  () => (cardOptions.value = null)
)

const { data: workspaces } = useQuery(
  ['action-workspaces', () => systemStore.isWorkspacesAllowed],
  () => {
    if (!systemStore.isWorkspacesAllowed) {
      return Promise.resolve(null)
    }
    return jumper.workspaces.listWorkspaces({
      limit: 10000
    })
  }
)

const onSubmit = handleSubmit(async values => {
  try {
    if (!actionDetailed.value) return
    await props.actionsComposable.update(actionDetailed.value.id, {
      ...values,
      data:
        values.data &&
        (values.data.type === 'Python' || values.data.type === 'Windows CMD')
          ? {
              ...values.data,
              comboboxCode: values.data.comboboxCode ?? ''
            }
          : values.data,
      user_ids: values.permissions.filter(p => 'username' in p).map(p => p.id),
      group_ids: values.permissions
        .filter(p => 'isAdminGroup' in p)
        .map(p => p.id),
      role_ids: values.permissions
        .filter(p => 'description' in p)
        .map(p => p.id)
    })
    versionsQuery.refetch()
  } catch (error) {
    if (error instanceof Error) {
      toast.error('Failed to update action.', {
        duration: 1500,
        description: error.message
      })
    }
    return false
  }
  toast(`'${values.name}' action updated.`, {
    duration: 1500,
    position: 'top-center',
    style: { 'margin-top': '15px' }
  })
  return true
})
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}

.transi {
  transition-duration: 400ms;
}
</style>
