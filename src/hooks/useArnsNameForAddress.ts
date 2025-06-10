import { useQuery } from '@tanstack/react-query'
import { getArNSRecords } from '@/services/arns-service'
import { ARNS_CACHE_CONFIG } from '@/services/cache-config'

/**
 * Hook to find the primary ArNS name for a given Arweave address/transaction ID
 * This performs a reverse lookup by searching through ArNS records
 */
export function useArnsNameForAddress(address: string) {
  return useQuery({
    queryKey: ['arns-reverse-lookup', address],
    queryFn: async () => {
      try {
        // Search through ArNS records to find one that resolves to this address
        // Note: This is a simplified approach. A more efficient solution would be
        // to have a reverse lookup index on the backend
        // REDUCED LIMIT: Changed from 1000 to 100 to reduce rate limiting
        const firstPage = await getArNSRecords({ limit: 100 })
        
        // For now, we'll check the first 100 records (reduced from 1000 to prevent rate limiting)
        // In a production app, you might want to implement a proper reverse lookup API
        for (const record of firstPage.items) {
          // This is a simplified check - in reality, you'd need to resolve each ArNS name
          // to see if it points to the given address. For performance, this should be
          // done server-side with proper indexing
          if (record.processId === address) {
            return record.name
          }
        }
        
        return null
      } catch (error) {
        console.error('Error in reverse ArNS lookup:', error)
        return null
      }
    },
    ...ARNS_CACHE_CONFIG,
    enabled: Boolean(address && address.length === 43), // Only run for valid Arweave IDs
  })
}

/**
 * Hook to get multiple ArNS names for multiple addresses
 */
export function useArnsNamesForAddresses(addresses: string[]) {
  return useQuery({
    queryKey: ['arns-reverse-lookup-batch', addresses.sort()],
    queryFn: async () => {
      const nameMap: Record<string, string> = {}
      
      try {
        // For a production implementation, this should be a batch API call
        // REDUCED LIMIT: Changed from 1000 to 100 to reduce rate limiting
        const firstPage = await getArNSRecords({ limit: 100 })
        
        for (const record of firstPage.items) {
          if (addresses.includes(record.processId)) {
            nameMap[record.processId] = record.name
          }
        }
        
        return nameMap
      } catch (error) {
        console.error('Error in batch reverse ArNS lookup:', error)
        return {}
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: addresses.length > 0 && addresses.every(addr => addr && addr.length === 43),
  })
}