/**
 * Centralized cache configuration for ArNS-related queries
 * Ensures consistent 24-hour TTL across all ArNS operations
 */

export const ARNS_CACHE_CONFIG = {
  // 24 hours for both stale time and garbage collection time
  staleTime: 1000 * 60 * 60 * 24, // 24 hours
  gcTime: 1000 * 60 * 60 * 24, // 24 hours
} as const

// For nanostore-based persistent caching
export const ARNS_NANOSTORE_TTL = 1000 * 60 * 60 * 24 // 24 hours in milliseconds

/**
 * Checks if a nanostore cache entry should be refreshed based on 24-hour TTL
 */
export function shouldRefreshNanostore(refreshTimestamp: string): boolean {
  if (refreshTimestamp === "0") return true
  
  const delta = new Date().getTime() - parseInt(refreshTimestamp)
  return delta > ARNS_NANOSTORE_TTL
}