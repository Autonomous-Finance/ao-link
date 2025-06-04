// @ts-ignore - AR-IO SDK types may not be fully resolved
import { ARIO } from '@ar.io/sdk/web'
import { arnsRequestThrottler, retryWithBackoff } from './request-throttle'

// Initialize AR-IO client for mainnet
const ario = ARIO.mainnet()

// Types from AR-IO SDK
export interface ArNSRecord {
  name: string
  processId: string
  startTimestamp: number
  endTimestamp?: number
  type: 'lease' | 'permabuy'
  purchasePrice?: number
  undernameLimit: number
}

export interface ArNSRecordsPage {
  items: ArNSRecord[]
  hasMore: boolean
  nextCursor?: string
  totalItems: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface ArNSNameResolution {
  processId: string
  txId: string
  type: string
  recordIndex: number
  undernameLimit: number
  owner: string
  name: string
}

/**
 * Get a paginated list of ArNS records, sorted by newest first
 */
export async function getArNSRecords({
  limit = 100,
  cursor,
}: {
  limit?: number
  cursor?: string
} = {}): Promise<ArNSRecordsPage> {
  try {
    const response = await arnsRequestThrottler.throttle(() =>
      retryWithBackoff(() =>
        ario.getArNSRecords({
          limit,
          cursor,
          sortBy: 'startTimestamp',
          sortOrder: 'desc',
        })
      )
    )

    return {
      items: (response as any).items.map((item: any) => ({
        name: item.name,
        processId: item.processId,
        startTimestamp: item.startTimestamp,
        endTimestamp: item.endTimestamp,
        type: item.type as 'lease' | 'permabuy',
        purchasePrice: item.purchasePrice,
        undernameLimit: item.undernameLimit,
      })),
      hasMore: (response as any).hasMore,
      nextCursor: (response as any).nextCursor,
      totalItems: (response as any).totalItems,
      sortBy: (response as any).sortBy,
      sortOrder: (response as any).sortOrder,
    }
  } catch (error) {
    console.error('Error fetching ArNS records:', error)
    throw error
  }
}

/**
 * Get a specific ArNS record by name
 */
export async function getArNSRecord(name: string): Promise<ArNSRecord | null> {
  try {
    const record = await ario.getArNSRecord({ name })
    return {
      name,
      processId: record.processId,
      startTimestamp: record.startTimestamp,
      endTimestamp: record.endTimestamp,
      type: record.type as 'lease' | 'permabuy',
      undernameLimit: record.undernameLimit,
    }
  } catch (error) {
    console.error(`Error fetching ArNS record for ${name}:`, error)
    return null
  }
}

/**
 * Resolve an ArNS name to get the underlying transaction ID and metadata
 */
export async function resolveArNSName(name: string): Promise<ArNSNameResolution | null> {
  try {
    const resolution = await arnsRequestThrottler.throttle(() =>
      retryWithBackoff(() =>
        ario.resolveArNSName({ name })
      )
    )
    return resolution as ArNSNameResolution | null
  } catch (error) {
    console.error(`Error resolving ArNS name ${name}:`, error)
    return null
  }
}

/**
 * Get all ArNS records (for migration compatibility)
 * Note: This method fetches all records by paginating through all pages
 */
export async function getAllArNSRecords(): Promise<Record<string, Omit<ArNSRecord, 'name'>>> {
  try {
    const allRecords: Record<string, Omit<ArNSRecord, 'name'>> = {}
    let hasMore = true
    let cursor: string | undefined

    while (hasMore) {
      const page = await getArNSRecords({ limit: 1000, cursor })
      
      for (const record of page.items) {
        allRecords[record.name] = {
          processId: record.processId,
          startTimestamp: record.startTimestamp,
          endTimestamp: record.endTimestamp,
          type: record.type,
          purchasePrice: record.purchasePrice,
          undernameLimit: record.undernameLimit,
        }
      }

      hasMore = page.hasMore
      cursor = page.nextCursor
    }

    return allRecords
  } catch (error) {
    console.error('Error fetching all ArNS records:', error)
    throw error
  }
}

/**
 * Legacy function for backward compatibility
 * Resolves ArNS name to transaction ID
 */
export async function resolveArns(name: string): Promise<string | null> {
  try {
    const resolution = await resolveArNSName(name)
    return resolution?.txId || null
  } catch (error) {
    console.error(`Error resolving ArNS ${name}:`, error)
    return null
  }
}

/**
 * Get the primary ArNS name for a specific address using AR-IO SDK
 */
export async function getPrimaryName(address: string): Promise<string | null> {
  try {
    const primaryName = await arnsRequestThrottler.throttle(() =>
      retryWithBackoff(() =>
        ario.getPrimaryName({ address })
      )
    )
    return (primaryName as any)?.name || null
  } catch (error) {
    console.error(`Error fetching primary name for ${address}:`, error)
    return null
  }
}

/**
 * Get all ArNS records owned by a specific address
 * TODO: This is currently commented out due to inefficiency. 
 * We need to wait for the AR-IO SDK to provide a proper owner filter.
 * Current implementation fetches ALL records and resolves each one individually,
 * which causes excessive API calls.
 */
export async function getArNSRecordsByOwner(ownerAddress: string): Promise<ArNSRecord[]> {
  console.warn('getArNSRecordsByOwner is disabled - waiting for AR-IO SDK owner filter support')
  return []
  
  // Commented out inefficient implementation:
  /*
  try {
    const allRecords: ArNSRecord[] = []
    let hasMore = true
    let cursor: string | undefined

    while (hasMore) {
      const page = await arnsRequestThrottler.throttle(() =>
        retryWithBackoff(() =>
          ario.getArNSRecords({
            limit: 1000,
            cursor,
            sortBy: 'startTimestamp',
            sortOrder: 'desc',
          })
        )
      )

      // Filter records by owner
      const ownedRecords = page.items.filter(record => {
        // Note: The AR-IO SDK may not directly expose owner info in the records
        // We'll need to resolve each record to get owner information
        return true // For now, we'll fetch all and filter in a separate step
      })

      for (const record of ownedRecords) {
        // Resolve each record to get ownership information
        const resolution = await resolveArNSName(record.name)
        if (resolution && resolution.owner === ownerAddress) {
          allRecords.push({
            name: record.name,
            processId: record.processId,
            startTimestamp: record.startTimestamp,
            endTimestamp: record.endTimestamp,
            type: record.type as 'lease' | 'permabuy',
            purchasePrice: record.purchasePrice,
            undernameLimit: record.undernameLimit,
          })
        }
      }

      hasMore = page.hasMore
      cursor = page.nextCursor
    }

    return allRecords
  } catch (error) {
    console.error(`Error fetching ArNS records for owner ${ownerAddress}:`, error)
    throw error
  }
  */
}

/**
 * Get owned domains for a specific entity (address) - legacy compatibility
 */
export async function getOwnedDomains(entityId: string): Promise<string[]> {
  try {
    const records = await getArNSRecordsByOwner(entityId)
    return records.map(record => record.name)
  } catch (error) {
    console.error('Error fetching owned domains:', error)
    return []
  }
}