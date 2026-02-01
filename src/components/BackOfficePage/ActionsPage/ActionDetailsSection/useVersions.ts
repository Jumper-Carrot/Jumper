import type { User } from '@@types'
import type { ActionDetailedForm } from './useActionDetailedForm'

import { computed, MaybeRefOrGetter, ref, toRef } from 'vue'
import { ActionData, ActionVersion, DetailedAction } from '@@types/action'

import jumper from '@/services/jumper'
import { useQuery } from '@/composables'

export type VersionsComposable = ReturnType<typeof useVersions>

export const useVersions = (
  showVersions: MaybeRefOrGetter<boolean>,
  action: MaybeRefOrGetter<DetailedAction | null>,
  form: ActionDetailedForm
) => {
  const showVersionsRef = toRef(showVersions)
  const actionRef = toRef(action)
  const selectedVersion = ref<ActionVersion | null>(null)
  const { setValues } = form

  const versionsQuery = useQuery<ActionVersion[]>(
    ['action-versions', () => actionRef.value?.id, showVersionsRef],
    async () => {
      selectedVersion.value = null
      if (!actionRef.value || !showVersionsRef.value) return []
      const result = await jumper.actions.getVersions(actionRef.value.id)
      if (!result.length) return []
      selectedVersion.value = result[0]
      return result
    }
  )

  const selectVersion = (version: ActionVersion) => {
    selectedVersion.value = version
    setValues({
      name: version.name,
      description: version.description,
      isPublic: version.isPublic,
      data: version.data,
      isActive: version.isActive,
      thumbnailKey: version.thumbnailKey,
      permissions: [
        ...(version.users || []).filter((u): u is User => 'externalId' in u),
        ...version.groups,
        ...version.roles
      ],
      hasDelayBeforeRelaunch: version.hasDelayBeforeRelaunch ?? false,
      delayBeforeRelaunch: version.delayBeforeRelaunch ?? 1000
    })
  }

  const differentDataFields = computed(() => {
    if (
      !showVersionsRef.value ||
      !actionRef.value ||
      !selectedVersion.value ||
      !form.values.data
    )
      return []
    const actionData = actionRef.value.data
    const formData = form.values.data
    return Object.entries(actionData).reduce((acc, [key, value]) => {
      if (key in formData) {
        const formValue = formData[key as keyof ActionData]
        if (formValue !== value) {
          acc.push(key)
        }
      }
      return acc
    }, [] as string[])
  })

  return {
    versionsQuery,
    versions: computed(() => versionsQuery.data.value ?? []),
    selectedVersion,
    selectVersion,
    differentDataFields
  }
}
