import { useQuery } from '@tanstack/react-query'
import { getArNSLogo } from '@/services/arns-service'
import { ARNS_CACHE_CONFIG } from '@/services/cache-config'

/**
 * Hook to get the logo transaction ID for an ArNS name
 */
export function useArnsLogo(name: string) {
  return useQuery({
    queryKey: ['arns-logo', name],
    queryFn: async () => {
      if (!name) {
        return null
      }
      
      return await getArNSLogo(name)
    },
    ...ARNS_CACHE_CONFIG,
    enabled: Boolean(name),
  })
}