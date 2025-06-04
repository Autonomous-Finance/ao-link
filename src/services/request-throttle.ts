/**
 * Request throttling utility to prevent rate limiting issues
 */

class RequestThrottler {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private readonly delayMs: number

  constructor(delayMs = 100) {
    this.delayMs = delayMs
  }

  async throttle<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })

      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return
    }

    this.processing = true

    while (this.queue.length > 0) {
      const request = this.queue.shift()
      if (request) {
        try {
          await request()
        } catch (error) {
          console.error('Throttled request failed:', error)
        }
        
        // Add delay between requests
        if (this.queue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.delayMs))
        }
      }
    }

    this.processing = false
  }
}

// Global throttler instance for ArNS requests
export const arnsRequestThrottler = new RequestThrottler(200) // 200ms between requests

/**
 * Retry logic for handling 429 rate limit errors
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error = new Error('No attempts made')

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error
      
      // Check if it's a rate limit error
      if (error.status === 429 || error.message?.includes('429')) {
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt) // Exponential backoff
          console.warn(`Rate limited (429), retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      
      // For non-rate-limit errors, don't retry
      if (error.status !== 429) {
        throw error
      }
    }
  }

  throw lastError
}