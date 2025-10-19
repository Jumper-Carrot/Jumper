import type { Page, DetailedWorkspace, Order } from '@@types'
import { ref } from 'vue'
import { useQuery, useQueryPage, useQuerySearch } from '@/composables/query'
import jumper from '@/services/jumper'

export const useWorkspacesQuery = (
  options: {
    page?: number
    limit?: number
    search?: string
    activeOnly?: boolean
    orderBy?: Order
    searchNeeded?: boolean
    searchDebounceTime?: number
  } = {}
) => {
  const { currentPage, limit, itemsCount, catchPageError } =
    useQueryPage(options)

  const { search, debouncedSearch, isSearchDebouncing } =
    useQuerySearch(options)

  const activeOnly = ref(options.activeOnly || true)
  const orderBy = ref<Order>(
    options.orderBy || { field: 'username', direction: 'asc' }
  )

  const query = useQuery<Page<DetailedWorkspace>>(
    [
      'detailed-workspaces',
      currentPage,
      limit,
      activeOnly,
      debouncedSearch,
      orderBy
    ],
    catchPageError(() => {
      if (options.searchNeeded && search.value === '')
        return Promise.resolve({ count: 0, results: [] })
      return jumper.workspaces.listWorkspaces({
        detail: true,
        page: currentPage.value,
        limit: limit.value,
        is_active: activeOnly.value ? true : undefined,
        search: debouncedSearch.value || undefined,
        ordering: `${orderBy.value.direction == 'desc' ? '-' : ''}${orderBy.value.field}`
      })
    })
  )

  return {
    ...query,

    activeOnly,
    orderBy,

    currentPage,
    limit,
    itemsCount,

    search,
    isSearchDebouncing
  }
}
