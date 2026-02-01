<template>
  <div class="bg-muted/40 border-r">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="w-[200px] flex-1">
        <nav class="flex h-full w-full flex-col px-2 py-2 text-sm font-medium">
          <div v-for="item in menuItems" :key="item.title">
            <Collapsible
              as-child
              class="group/collapsible w-full"
              :defaultOpen="
                item.children?.some(c =>
                  $route.matched.some(r => r.name == c.page)
                )
              "
              v-slot="{ open }"
              v-if="item.condition()"
            >
              <CollapsibleTrigger>
                <component
                  :is="item.page ? 'router-link' : 'div'"
                  :to="{ name: item.page }"
                  class="text-muted-foreground flex items-center gap-3
                    rounded-lg px-3 py-2 transition-all hover:bg-slate-100
                    dark:hover:bg-slate-800"
                  :class="{
                    [`text-primary dark:text-primary bg-slate-100
                    dark:bg-slate-800`]: $route.matched.some(
                      r => r.name == item.page
                    ),
                    'dark:text-slate-300': !$route.matched.some(
                      r => r.name == item.page
                    )
                  }"
                >
                  <component v-if="item.icon" :is="item.icon" class="h-4 w-4" />
                  <p class="grow text-left">{{ item.title }}</p>
                  <ChevronRight
                    v-if="item.children"
                    class="group/collapsible/trigger h-4 w-4
                      transition-transform duration-300"
                    :class="{
                      'rotate-90': open
                    }"
                  />
                </component>
              </CollapsibleTrigger>
              <CollapsibleContent
                v-if="item.children"
                class="mb-1 ml-5 border-l border-slate-200 pl-1
                  dark:border-slate-300"
              >
                <template v-for="child in item.children" :key="child.title">
                  <RouterLink
                    v-if="child.condition()"
                    :to="{ name: child.page }"
                    class="text-muted-foreground mt-1 flex items-center gap-3
                      rounded-lg px-2 py-[6px] transition-all hover:bg-slate-100
                      dark:hover:bg-slate-800"
                    :class="{
                      [`text-primary dark:text-primary bg-slate-100
                      dark:bg-slate-800`]: $route.matched.some(
                        r => r.name == child.page
                      ),
                      'dark:text-slate-300': !$route.matched.some(
                        r => r.name == child.page
                      )
                    }"
                  >
                    <p class="text-sm">{{ child.title }}</p>
                  </RouterLink>
                </template>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <RouterLink :to="{ name: 'info' }" class="mt-auto w-full">
            <Button
              variant="ghost"
              class="hover:text-primary dark:hover:text-primary w-full
                justify-start px-3 text-sm text-slate-400 transition-colors
                dark:text-slate-500"
              :class="{
                'text-primary dark:text-primary bg-slate-100 dark:bg-slate-800':
                  $route.matched.some(r => r.name == 'info'),
                'dark:text-slate-300': !$route.matched.some(
                  r => r.name == 'info'
                )
              }"
            >
              <Info />
              Info
            </Button>
          </RouterLink>
          <Button
            variant="ghost"
            class="hover:text-destructive dark:hover:text-destructive mb-2
              justify-start px-3 text-sm text-slate-400 transition-colors
              dark:text-slate-500"
            @click="authUserStore.signOut"
          >
            <LogOut />
            Logout
          </Button>
          <RouterLink
            :to="{ name: 'home' }"
            class="text-muted-foreground flex items-center gap-3 rounded-lg px-3
              py-2 transition-all hover:bg-slate-100 dark:text-slate-300
              dark:hover:bg-slate-800"
          >
            <ChevronLeft class="h-4 w-4" />
            <p class="grow text-left">Back to home</p>
          </RouterLink>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  Carrot,
  User,
  Users,
  LogOut,
  Info,
  Settings
} from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { useAuthUserStore, useBackendInfoStore, useSystemStore } from '@/stores'

import { Button } from '@@materials/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@@materials/ui/collapsible'

const authUserStore = useAuthUserStore()
const backendInfoStore = useBackendInfoStore()
const systemStore = useSystemStore()

const menuItems = [
  {
    title: 'My account',
    icon: User,
    condition: () => true,
    children: [
      {
        title: 'Profile',
        page: 'profile',
        condition: () => true
      },
      {
        title: 'Appearance',
        page: 'appearance',
        condition: () => true
      }
    ]
  },

  {
    title: 'Users',
    icon: Users,
    condition: () =>
      authUserStore.isAdmin ||
      authUserStore.isUserManager ||
      authUserStore.isActionManager,
    children: [
      {
        title: 'Users',
        page: 'all-users',
        condition: () => true
      },
      {
        title: 'Groups',
        page: 'groups',
        condition: () => backendInfoStore.isScimEnabled
      },
      {
        title: 'Roles',
        page: 'roles',
        condition: () => true
      }
    ]
  },
  {
    title: 'Actions',
    icon: Carrot,
    condition: () => authUserStore.isAdmin || authUserStore.isActionManager,
    children: [
      {
        title: 'Workspaces',
        page: 'workspaces',
        condition: () => systemStore.isWorkspacesAllowed
      },
      {
        title: 'Action editor',
        page: 'action-editor',
        condition: () => true
      }
    ]
  },
  {
    title: 'System',
    page: 'system',
    icon: Settings,
    condition: () => authUserStore.isAdmin
  }
]
</script>
