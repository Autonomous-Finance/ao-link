import { useCallback } from "react"

export function useUpdateSearch() {
  const updateSearch = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    const newValue = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, "", newValue)
  }, [])

  return updateSearch
}
