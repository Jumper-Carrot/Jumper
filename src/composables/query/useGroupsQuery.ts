import type { Group, Order, Page } from '@@types'

import { ref } from 'vue'

import jumper from '@/services/jumper'

import { useQuery } from './useQuery'
import { useQueryPage } from './useQueryPage'
import { useQuerySearch } from './useQuerySearch'

export const useGroupsQuery = (
  options: {
    page?: number
    limit?: number
    search?: string
    orderBy?: Order
    searchNeeded?: boolean
    searchDebounceTime?: number
  } = {}
) => {
  const { currentPage, limit, itemsCount, catchPageError } =
    useQueryPage(options)

  const { search, debouncedSearch, isSearchDebouncing } =
    useQuerySearch(options)

  const orderBy = ref<Order>(
    options.orderBy || { field: 'name', direction: 'asc' }
  )

  const query = useQuery<Page<Group>>(
    ['groups', currentPage, limit, debouncedSearch, orderBy],
    catchPageError(() => {
      if (options.searchNeeded && search.value === '')
        return Promise.resolve({ count: 0, results: [] })
      return jumper.groups.getGroups({
        page: currentPage.value,
        limit: limit.value,
        search: debouncedSearch.value || undefined,
        ordering: `${orderBy.value.direction == 'desc' ? '-' : ''}${orderBy.value.field}`
      })
    })
  )

  return {
    ...query,

    orderBy,

    currentPage,
    limit,
    itemsCount,

    search,
    isSearchDebouncing
  }
}
