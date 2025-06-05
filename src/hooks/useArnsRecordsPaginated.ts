import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { getArNSRecords, ArNSRecordsPage } from '@/services/arns-service'
import { ARNS_CACHE_CONFIG } from '@/services/cache-config'
import { populateIndividualRecordCaches } from '@/services/arns-cache-utils'

/**
 * Hook for fetching paginated ArNS records with caching
 */
export function useArnsRecordsPaginated(limit = 100) {
  const queryClient = useQueryClient()
  
  return useInfiniteQuery<ArNSRecordsPage, Error>({
    queryKey: ['arns-records', limit],
    queryFn: async ({ pageParam }) => {
      const result = await getArNSRecords({ 
        limit, 
        cursor: pageParam as string | undefined 
      })
      
      // Populate individual record caches for optimization
      populateIndividualRecordCaches(queryClient, result.items)
      
      return result
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    ...ARNS_CACHE_CONFIG,
  })
}