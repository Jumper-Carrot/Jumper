<template>
  <BackOfficePageLayout>
    <BackOfficeHeader title="Groups" description="Manage SSO groups." />
    <div class="flex items-center gap-4">
      <SearchBar v-model="search" class="mr-auto w-[280px] shrink" />
    </div>
    <TableLayout
      class="my-3 h-full"
      :error-message="errorMessage"
      :is-loading="isFetching || isSearchDebouncing"
      :data="groupsPage?.results"
      item-name="group"
    >
      <template #header>
        <TableHead class="w-[250px]"
          ><OrderByButton field="name" v-model:order="orderBy">
            Name
          </OrderByButton>
        </TableHead>
        <TableHead class="w-[180px]">
          <OrderByButton field="user_set,name" v-model:order="orderBy">
            Users
          </OrderByButton>
        </TableHead>
        <TableHead></TableHead>
      </template>
      <template #default="{ item: group }">
        <GroupRow :group="group" />
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
import { useGroupsQuery } from '@/composables/query/useGroupsQuery'

import { OrderByButton, SearchBar } from '@/components/@materials/input'
import { PaginationFooter, TableLayout } from '@/components/@materials/table'
import { TableHead } from '@/components/@materials/ui/table'
import {
  BackOfficeHeader,
  BackOfficePageLayout
} from '@/components/BackOfficePage/@common'
import GroupRow from './GroupRow.vue'

const {
  data: groupsPage,
  isFetching,
  errorMessage,
  limit,
  search,
  orderBy,
  currentPage,
  itemsCount,
  isSearchDebouncing
} = useGroupsQuery({
  searchDebounceTime: 400
})
</script>
