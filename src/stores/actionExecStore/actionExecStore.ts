import type { Action, PlayableAction } from '@@types'
import { watch } from 'vue'
import {
  type ActionExec,
  useActionExec
} from '@/stores/actionExecStore/useActionExec'
import { useRoute } from 'vue-router'

import { defineStore } from 'pinia'

export const useActionExecStore = defineStore('actionExec', () => {
  let actionExecutions: Record<Action['id'], ActionExec> = {}

  const route = useRoute()

  const useAction = (action: PlayableAction) => {
    let actionExec = actionExecutions[action.id]
    if (!actionExec) {
      actionExec = useActionExec(action)
      actionExecutions[action.id] = actionExec
    }
    return actionExec
  }

  watch(
    () => route.matched,
    () => {
      if (!route.matched.some((m) => m.name === 'home')) {
        actionExecutions = {}
      }
    }
  )

  return { useAction }
})
