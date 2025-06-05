import { QueryClient } from '@tanstack/react-query'
import { ArNSRecord, ArNSNameResolution } from './arns-service'
import { ARNS_CACHE_CONFIG } from './cache-config'

/**
 * Utility functions for optimizing ArNS cache sharing between different queries
 */

/**
 * Populates individual record caches when we fetch paginated records
 * This allows individual record lookups to use cached data from paginated fetches
 */
export function populateIndividualRecordCaches(
  queryClient: QueryClient,
  records: ArNSRecord[]
) {
  records.forEach(record => {
    // Cache individual record by name
    queryClient.setQueryData(
      ['arns-record', record.name],
      record,
      { updatedAt: Date.now(), ...ARNS_CACHE_CONFIG }
    )
    
    // If we have resolution data, cache that too
    if (record.processId) {
      const resolutionData: ArNSNameResolution = {
        processId: record.processId,
        txId: '', // This would need to be fetched separately if needed
        type: record.type,
        recordIndex: 0, // Default value
        undernameLimit: record.undernameLimit,
        owner: '', // This would need to be fetched separately if needed
        name: record.name
      }
      
      queryClient.setQueryData(
        ['arns-resolution', record.name],
        resolutionData,
        { updatedAt: Date.now(), ...ARNS_CACHE_CONFIG }
      )
    }
  })
}

/**
 * Populates reverse lookup cache when we fetch a primary name
 * This helps optimize future reverse lookups
 */
export function populateReverseLookupCache(
  queryClient: QueryClient,
  address: string,
  primaryName: string | null
) {
  // Cache the reverse lookup result
  queryClient.setQueryData(
    ['arns-reverse-lookup', address],
    primaryName,
    { updatedAt: Date.now(), ...ARNS_CACHE_CONFIG }
  )
}

/**
 * Invalidates related ArNS caches when data might be stale
 * Use this when you know ArNS data has been updated
 */
export function invalidateArnsCache(queryClient: QueryClient, name?: string) {
  if (name) {
    // Invalidate specific name-related queries
    queryClient.invalidateQueries({ queryKey: ['arns-record', name] })
    queryClient.invalidateQueries({ queryKey: ['arns-resolution', name] })
  } else {
    // Invalidate all ArNS-related queries
    queryClient.invalidateQueries({ queryKey: ['arns-record'] })
    queryClient.invalidateQueries({ queryKey: ['arns-resolution'] })
    queryClient.invalidateQueries({ queryKey: ['arns-records'] })
    queryClient.invalidateQueries({ queryKey: ['primary-arns-name'] })
    queryClient.invalidateQueries({ queryKey: ['arns-reverse-lookup'] })
  }
}

/**
 * Prefetches commonly used ArNS data
 * Call this on app initialization or when you expect ArNS lookups
 */
export function prefetchCommonArnsData(queryClient: QueryClient, commonNames: string[]) {
  commonNames.forEach(name => {
    queryClient.prefetchQuery({
      queryKey: ['arns-record', name],
      queryFn: async () => {
        const { getArNSRecord } = await import('./arns-service')
        return getArNSRecord(name)
      },
      ...ARNS_CACHE_CONFIG,
    })
  })
}