import { useQuery } from '@tanstack/react-query'
import { resolveArNSName } from '@/services/arns-service'
import { ARNS_CACHE_CONFIG } from '@/services/cache-config'

/**
 * Hook to resolve an ArNS name to transaction details with 24-hour caching
 */
export function useArnsResolution(name: string) {
  return useQuery({
    queryKey: ['arns-resolution', name],
    queryFn: async () => {
      if (!name || !name.trim()) {
        return null
      }
      return await resolveArNSName(name.trim())
    },
    ...ARNS_CACHE_CONFIG,
    enabled: Boolean(name && name.trim()),
  })
}