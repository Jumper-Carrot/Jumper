<template>
  <BackOfficePageLayout>
    <BackOfficeHeader
      title="Workspaces"
      description="Manage Jumper's workspaces"
    />
    <div class="flex items-center gap-4">
      <SearchBar
        v-model="search"
        :debounce="400"
        class="mr-auto w-[280px] flex-shrink"
      />
      <div class="flex flex-shrink-0 items-center gap-2">
        <Label class="text-[13px] text-slate-700 dark:text-slate-500"
          >Active only</Label
        >
        <Switch v-model="activeOnly" />
      </div>
      <AddWorkspaceButton
        @workspaceAdded="refetch"
        v-if="authUserStore.isAdmin"
      />
    </div>
    <TableLayout
      class="my-3 h-full"
      :error-message="errorMessage"
      :is-loading="isFetching || isSearchDebouncing"
      :data="workspacesPage?.results"
      item-name="workspace"
    >
      <template #header>
        <TableHead class="w-[250px]"
          ><OrderByButton field="name" v-model:order="orderBy">
            Name
          </OrderByButton>
        </TableHead>
        <TableHead v-if="!activeOnly" class="w-[50px]">
          <OrderByButton field="is_active,name" v-model:order="orderBy">
            Active
          </OrderByButton>
        </TableHead>
        <TableHead></TableHead>
      </template>
      <template #default="{ item: workspace }">
        <WorkspaceRow
          :workspace="workspace"
          :active-only="activeOnly"
          @workspace-updated="refetch()"
        />
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
import { useWorkspacesQuery } from './useWorkspacesQuery'
import { useAuthUserStore } from '@/stores'
import { TableHead } from '@@materials/ui/table'
import { Switch } from '@@materials/ui/switch'
import { Label } from '@@materials/ui/label'
import { SearchBar } from '@@materials/input'
import { OrderByButton } from '@@materials/input'
import { PaginationFooter, TableLayout } from '@@materials/table'
import {
  BackOfficePageLayout,
  BackOfficeHeader
} from '@/components/BackOfficePage/@common'
import WorkspaceRow from './WorkspaceRow.vue'
import AddWorkspaceButton from './modals/AddWorkspaceButton.vue'

const authUserStore = useAuthUserStore()

const {
  data: workspacesPage,
  isFetching,
  errorMessage,
  refetch,
  currentPage,
  limit,
  itemsCount,
  orderBy,
  search,
  activeOnly,
  isSearchDebouncing
} = useWorkspacesQuery({
  searchDebounceTime: 400
})
</script>
