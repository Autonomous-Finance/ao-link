import { useQuery } from '@tanstack/react-query'
import { getArNSRecord } from '@/services/arns-service'
import { ARNS_CACHE_CONFIG } from '@/services/cache-config'

/**
 * Hook to get a specific ArNS record by name with 24-hour caching
 */
export function useArnsRecord(name: string) {
  return useQuery({
    queryKey: ['arns-record', name],
    queryFn: async () => {
      if (!name || !name.trim()) {
        return null
      }
      return await getArNSRecord(name.trim())
    },
    ...ARNS_CACHE_CONFIG,
    enabled: Boolean(name && name.trim()),
  })
}