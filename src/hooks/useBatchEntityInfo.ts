import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { usePrimaryArnsName } from './usePrimaryArnsName'
import { ARNS_CACHE_CONFIG } from '@/services/cache-config'

/**
 * Hook to batch fetch entity information for multiple entity IDs
 * Efficiently handles ArNS lookups for table displays
 */
export function useBatchEntityInfo(entityIds: string[]) {
  // Get unique entity IDs to avoid duplicate queries
  const uniqueEntityIds = useMemo(() => {
    return [...new Set(entityIds.filter(id => id && id.length === 43))]
  }, [entityIds])

  // Batch fetch primary names for all unique entities
  const primaryNameQueries = useQueries({
    queries: uniqueEntityIds.map(entityId => ({
      queryKey: ['primary-arns-name', entityId],
      queryFn: async () => {
        const { getPrimaryName } = await import('@/services/arns-service')
        return await getPrimaryName(entityId)
      },
      ...ARNS_CACHE_CONFIG,
      enabled: Boolean(entityId && entityId.length === 43),
    }))
  })

  // Create a map of entityId -> primary name for easy lookup
  const entityPrimaryNames = useMemo(() => {
    const nameMap: Record<string, string | null> = {}
    
    uniqueEntityIds.forEach((entityId, index) => {
      const query = primaryNameQueries[index]
      if (query.data !== undefined) {
        nameMap[entityId] = query.data
      }
    })
    
    return nameMap
  }, [uniqueEntityIds, primaryNameQueries])

  // Check if any queries are still loading
  const isLoading = primaryNameQueries.some(query => query.isLoading)

  return {
    entityPrimaryNames,
    isLoading,
    // Helper function to get primary name for a specific entity
    getPrimaryName: (entityId: string) => entityPrimaryNames[entityId] || null,
  }
}