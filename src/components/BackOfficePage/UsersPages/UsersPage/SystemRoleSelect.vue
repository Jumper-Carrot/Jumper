<template>
  <Popover
    v-model:open="isOpen"
    v-if="authUserStore.isAdmin || authUserStore.isUserManager"
  >
    <PopoverTrigger as-child>
      <Button variant="outline" class="w-full px-3 text-sm max-xl:w-28">
        <p class="flex-grow truncate text-left">
          {{ getRoleDisplayText(role) }}
        </p>
        <ChevronDownIcon class="ml-2 h-4 w-4 text-muted-foreground" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0" align="start" @click="isOpen = false">
      <Command v-model="role">
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="systemRole in SYSTEM_ROLES"
              :key="systemRole.value"
              :value="systemRole.value"
              class="flex flex-col items-start space-y-1 px-4 py-2"
            >
              <p>{{ systemRole.label }}</p>
              <p class="text-sm text-muted-foreground">
                {{ systemRole.description }}
              </p>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
  <span v-else class="text-slate-700 dark:text-slate-400 font-semibold">
    {{ getRoleDisplayText(role) }}
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthUserStore } from '@/stores'
import type { SystemRole } from '@@types'
import { ChevronDownIcon } from 'lucide-vue-next'
import { Button } from '@@materials/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@@materials/ui/popover'

const authUserStore = useAuthUserStore()
const role = defineModel<string>()
const isOpen = ref(false)

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from '@@materials/ui/command'

const SYSTEM_ROLES: {
  value: SystemRole
  label: string
  description: string
}[] = [
  {
    value: 'user',
    label: 'User',
    description: 'Limited access to personal settings.'
  },
  {
    value: 'user_manager',
    label: 'User Manager',
    description: 'Can manage user accounts and roles.'
  },
  {
    value: 'action_manager',
    label: 'Action Manager',
    description: 'Can manage actions and action access.'
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full access to all settings and management features.'
  }
]

const getRoleDisplayText = (role: string | undefined) => {
  const foundRole = SYSTEM_ROLES.find((r) => r.value === role)
  return foundRole ? foundRole.label : 'Select role'
}
</script>
