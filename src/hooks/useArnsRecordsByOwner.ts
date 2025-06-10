import { useQuery } from '@tanstack/react-query'
import { getArNSRecordsByOwner, ArNSRecord } from '@/services/arns-service'
import { ARNS_CACHE_CONFIG } from '@/services/cache-config'

/**
 * Hook to fetch all ArNS records owned by a specific address
 */
export function useArnsRecordsByOwner(ownerAddress: string) {
  return useQuery({
    queryKey: ['arns-records-by-owner', ownerAddress],
    queryFn: async () => await getArNSRecordsByOwner(ownerAddress),
    enabled: !!ownerAddress,
    ...ARNS_CACHE_CONFIG,
  })
}

/**
 * Hook to get paginated ArNS records owned by a specific address
 * This provides pagination-compatible data for the AsyncTable component
 */
export function useArnsRecordsByOwnerPaginated(
  ownerAddress: string,
  limit: number = 25,
  offset: number = 0
) {
  const { data: allRecords, ...rest } = useArnsRecordsByOwner(ownerAddress)

  // Calculate paginated subset
  const paginatedRecords = allRecords?.slice(offset, offset + limit) || []
  const hasMore = allRecords ? offset + limit < allRecords.length : false
  const totalCount = allRecords?.length || 0

  return {
    ...rest,
    data: {
      records: paginatedRecords,
      hasMore,
      totalCount,
    },
  }
}