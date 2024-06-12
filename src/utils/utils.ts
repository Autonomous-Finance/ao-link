export function wait(time: number): Promise<null> {
  return new Promise((resolve) => setTimeout(() => resolve(null), time))
}

export function timeout(time: number) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), time))
}

/**
 * Returns if this is a valid arweave id
 */
export const isArweaveId = (addr: string) => /[a-z0-9_-]{43}/i.test(addr)

export const isBrowser = typeof window !== "undefined"
export const isStaging = isBrowser && window.location.toString().includes("staging")
export const isDevelopment = isBrowser && window.location.toString().includes("localhost")
