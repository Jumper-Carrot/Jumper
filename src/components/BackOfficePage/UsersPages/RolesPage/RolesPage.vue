<template>
  <BackOfficePageLayout>
    <BackOfficeHeader
      title="Roles"
      description="Use role to assign actions to user easily."
    />
    <div class="flex items-center gap-4">
      <SearchBar v-model="search" class="mr-auto w-[280px] shrink" />
      <AddRoleButton
        @role-added="refetch"
        v-if="authUserStore.isAdmin || authUserStore.isUserManager"
      />
    </div>
    <TableLayout
      class="my-3 h-full"
      :error-message="errorMessage"
      :is-loading="isFetching || isSearchDebouncing"
      :data="rolesPage?.results"
      item-name="role"
    >
      <template #header>
        <TableHead class="w-[250px]"
          ><OrderByButton field="name" v-model:order="orderBy">
            Name
          </OrderByButton>
        </TableHead>
        <TableHead class="w-[180px]">
          <OrderByButton field="user_count,name" v-model:order="orderBy">
            Users
          </OrderByButton>
        </TableHead>
        <TableHead v-if="isScimEnabled" class="w-[180px]">
          <OrderByButton field="group_count,name" v-model:order="orderBy">
            Groups
          </OrderByButton>
        </TableHead>
        <TableHead></TableHead>
      </template>
      <template #default="{ item: role }">
        <RoleRow :role="role" @role-updated="refetch()" />
      </template>
    </TableLayout>
    <PaginationFooter
      v-model:current-page="currentPage"
      v-model:items-per-page="limit"
      :item-count="itemsCount"
    />
  </BackOfficePageLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAuthUserStore, useBackendInfoStore } from '@/stores'
import { useRolesQuery } from '@/composables/query/useRolesQuery'

import { OrderByButton, SearchBar } from '@@materials/input'
import { PaginationFooter, TableLayout } from '@@materials/table'
import { TableHead } from '@@materials/ui/table'
import {
  BackOfficeHeader,
  BackOfficePageLayout
} from '@/components/BackOfficePage/@common'
import RoleRow from './RoleRow.vue'
import { AddRoleButton } from './modals'

const authUserStore = useAuthUserStore()
const { isScimEnabled } = storeToRefs(useBackendInfoStore())

const {
  data: rolesPage,
  isFetching,
  errorMessage,
  refetch,
  itemsCount,
  search,
  limit,
  currentPage,
  orderBy,
  isSearchDebouncing
} = useRolesQuery({
  searchDebounceTime: 400
})
</script>
