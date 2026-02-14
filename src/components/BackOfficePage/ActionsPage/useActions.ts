import type { Action, DetailedAction } from '@@types'

import { computed, ref } from 'vue'
import { watch } from 'vue'

import jumper from '@/services/jumper'
import { useQuery } from '@/composables'

export type ActionsComposable = ReturnType<typeof useActions>

const SELECTED_ACTION_ID_KEY = 'actions:selectedActionId'

export const useActions = () => {
  const search = ref('')
  const selectedAction = ref<Action | null>(null)

  // TODO: see how to manage infinite scroll
  const actionsQuery = useQuery<Action[]>(['actions', search], async () => {
    const data = await jumper.actions.getActions({
      limit: 10000,
      search: search.value
    })
    if (!selectedAction.value && data.results.length) {
      const storedId = localStorage.getItem(SELECTED_ACTION_ID_KEY)
      const storedIdNum = storedId !== null ? Number(storedId) : null
      const found =
        storedIdNum !== null && !isNaN(storedIdNum)
          ? data.results.find(a => a.id === storedIdNum)
          : null
      if (found) {
        selectedAction.value = found
      } else {
        selectedAction.value = data.results[0]
      }
    }
    return data.results
  })

  const actionDetailedQuery = useQuery<DetailedAction | null>(
    ['action-detailed', selectedAction],
    async () => {
      if (!selectedAction.value) return null
      return jumper.actions.getDetailedAction(selectedAction.value.id)
    }
  )

  const create = async (action: Partial<Action>) => {
    const newAction = await jumper.actions.create(action)
    selectedAction.value = newAction
    localStorage.setItem(SELECTED_ACTION_ID_KEY, String(newAction.id))
    actionsQuery.setData(prev => {
      if (!prev) return [newAction]
      return [...prev, newAction]
    })
    return newAction
  }

  const update = async (
    actionId: DetailedAction['id'],
    action: Partial<DetailedAction>
  ) => {
    const updatedAction = await jumper.actions.update(actionId, action)
    actionDetailedQuery.setData(() => updatedAction)
    if (selectedAction.value?.id === actionId) {
      localStorage.setItem(SELECTED_ACTION_ID_KEY, String(actionId))
    }
    actionsQuery.refetch()
    return updatedAction
  }

  const updateThumbnail = async (
    actionId: DetailedAction['id'],
    thumbnail: File
  ) => {
    const { url, key } = await jumper.actions.updateActionThumbnail(
      actionId,
      thumbnail
    )
    return { url, key }
  }

  const remove = async (actionId: DetailedAction['id']) => {
    await jumper.actions.remove(actionId)
    await actionsQuery.refetch()
    if (selectedAction.value?.id === actionId) {
      if (actionsQuery.data.value?.length) {
        selectedAction.value = actionsQuery.data.value[0]
        localStorage.setItem(
          SELECTED_ACTION_ID_KEY,
          String(selectedAction.value.id)
        )
      } else {
        selectedAction.value = null
        localStorage.removeItem(SELECTED_ACTION_ID_KEY)
      }
    }
  }

  watch(selectedAction, val => {
    if (val?.id !== undefined && val?.id !== null) {
      localStorage.setItem(SELECTED_ACTION_ID_KEY, String(val.id))
    } else {
      localStorage.removeItem(SELECTED_ACTION_ID_KEY)
    }
  })

  return {
    actions: computed(() => actionsQuery.data.value ?? null),
    actionDetailed: computed(() => actionDetailedQuery.data.value ?? null),
    selectedAction,
    actionsQuery,
    actionDetailedQuery,
    search,
    create,
    update,
    updateThumbnail,
    remove
  }
}
