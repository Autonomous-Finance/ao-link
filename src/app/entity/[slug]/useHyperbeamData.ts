import { useEffect, useState, Dispatch, SetStateAction } from "react"

interface UseHyperbeamDataParams {
  selectedNodeUrl: string
  open: boolean
  usingCustom: boolean
  customNodeUrl: string | null
  customNodeError: string | null
  processPath: string
  $hyperbeamData: any // You can replace 'any' with the actual type if available
}

interface UseHyperbeamDataResult {
  atSlot: string | null
  currentSlot: string | null
  atSlotLoading: boolean
  currentSlotLoading: boolean
  loadingKeys: boolean
  fetchError: string | null
  nodeSwitching: boolean
  setNodeSwitching: Dispatch<SetStateAction<boolean>>
  refetchSlots: () => void
  setFetchError: Dispatch<SetStateAction<string | null>>
}

export function useHyperbeamData({
  selectedNodeUrl,
  open,
  usingCustom,
  customNodeUrl,
  customNodeError,
  processPath,
  $hyperbeamData,
}: UseHyperbeamDataParams): UseHyperbeamDataResult {
  const [atSlot, setAtSlot] = useState<string | null>(null)
  const [currentSlot, setCurrentSlot] = useState<string | null>(null)
  const [atSlotLoading, setAtSlotLoading] = useState(false)
  const [currentSlotLoading, setCurrentSlotLoading] = useState(false)
  const [loadingKeys, setLoadingKeys] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [nodeSwitching, setNodeSwitching] = useState(false)

  // Fetch at-slot and slot/current immediately when panel opens
  const refetchSlots = () => {
    if (!open) return
    setAtSlotLoading(true)
    setCurrentSlotLoading(true)
    Promise.all([
      fetch(`${selectedNodeUrl}/compute/at-slot`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(data => setAtSlot(data?.body ?? String(data)))
        .catch(() => setAtSlot("(error)")),
      fetch(`${selectedNodeUrl}/slot/current`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(data => setCurrentSlot(data?.body ?? String(data)))
        .catch(() => setCurrentSlot("(error)")),
    ]).finally(() => {
      setAtSlotLoading(false)
      setCurrentSlotLoading(false)
    })
  }

  useEffect(() => {
    refetchSlots()
  }, [selectedNodeUrl, open])

  // Fetch keys/values
  useEffect(() => {
    if (!open) return
    const now = Date.now()
    if (!selectedNodeUrl || (usingCustom && (!customNodeUrl || !!customNodeError))) {
      // Don't fetch if no valid URL
      return
    }
    if ($hyperbeamData.get().keys && $hyperbeamData.get().values && now - $hyperbeamData.get().lastFetched < 60 * 60 * 1000) {
      return
    }
    setLoadingKeys(true)
    setFetchError(null)
    fetch(`${selectedNodeUrl}/compute/keys/serialize~json@1.0`, { method: "HEAD" })
      .then((r) => {
        return r.ok
          ? fetch(`${selectedNodeUrl}/compute/keys/serialize~json@1.0`).then((res) => res.json())
          : Promise.reject()
      })
      .then(async (data) => {
        const list = Array.isArray(data) ? data : Object.values(data)
        if (!list.length) {
          $hyperbeamData.set({ keys: [], values: {}, lastFetched: now })
          return
        }
        const url = `${selectedNodeUrl}/compute/serialize~json@1.0?keys=${list.join(",")}`
        const res = await fetch(url)
        let values = await res.json()
        if (Array.isArray(values)) {
          values = Object.fromEntries(list.map((k, i) => [k, values[i]]))
        }
        $hyperbeamData.set({ keys: list, values, lastFetched: now })
      })
      .catch((e) => {
        $hyperbeamData.set({ keys: null, values: {}, lastFetched: now })
        setFetchError("Failed to load data from this node. Please try another node or try again later.")
      })
      .finally(() => setLoadingKeys(false))
  }, [selectedNodeUrl, open, $hyperbeamData, usingCustom, customNodeUrl, customNodeError])

  return {
    atSlot,
    currentSlot,
    atSlotLoading,
    currentSlotLoading,
    loadingKeys,
    fetchError,
    nodeSwitching,
    setNodeSwitching,
    refetchSlots,
    setFetchError,
  }
} 