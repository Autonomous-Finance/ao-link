import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { useQuery } from '@tanstack/react-query';

interface UseHyperbeamDataParams {
  selectedNodeUrl: string
  open: boolean
  usingCustom: boolean
  customNodeUrl: string | null
  customNodeError: string | null
  processPath: string
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
  keys: string[] | null
  values: Record<string, any>
  refetchKeys: () => void
}

export function useHyperbeamData({
  selectedNodeUrl,
  open,
  usingCustom,
  customNodeUrl,
  customNodeError,
  processPath,
}: UseHyperbeamDataParams): UseHyperbeamDataResult {
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [nodeSwitching, setNodeSwitching] = useState(false)

  // React Query for atSlot
  const {
    data: atSlotData,
    isLoading: atSlotLoading,
    error: atSlotError,
    refetch: refetchAtSlot,
  } = useQuery({
    queryKey: ['hyperbeam-atSlot', selectedNodeUrl, open],
    queryFn: async () => {
      if (!open) return null;
      const res = await fetch(`${selectedNodeUrl}/compute/at-slot`);
      if (!res.ok) throw new Error('Failed to fetch at-slot');
      const data = await res.json();
      return data?.body ?? String(data);
    },
    enabled: open && !!selectedNodeUrl,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // React Query for currentSlot
  const {
    data: currentSlotData,
    isLoading: currentSlotLoading,
    error: currentSlotError,
    refetch: refetchCurrentSlot,
  } = useQuery({
    queryKey: ['hyperbeam-currentSlot', selectedNodeUrl, open],
    queryFn: async () => {
      if (!open) return null;
      const res = await fetch(`${selectedNodeUrl}/slot/current`);
      if (!res.ok) throw new Error('Failed to fetch current slot');
      const data = await res.json();
      return data?.body ?? String(data);
    },
    enabled: open && !!selectedNodeUrl,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // React Query for keys/values
  const fetchKeysAndValues = async () => {
    if (!selectedNodeUrl || (usingCustom && (!customNodeUrl || !!customNodeError))) {
      throw new Error('No valid node URL');
    }
    // Fetch keys
    const headRes = await fetch(`${selectedNodeUrl}/compute/keys/serialize~json@1.0`, { method: 'HEAD' });
    if (!headRes.ok) throw new Error('Failed to fetch keys');
    const keysRes = await fetch(`${selectedNodeUrl}/compute/keys/serialize~json@1.0`);
    const data = await keysRes.json();
    const list = Array.isArray(data) ? data : Object.values(data);
    if (!list.length) return { keys: [], values: {} };
    // Fetch values
    const valuesRes = await fetch(`${selectedNodeUrl}/compute/serialize~json@1.0?keys=${list.join(',')}`);
    let values = await valuesRes.json();
    if (Array.isArray(values)) {
      values = Object.fromEntries(list.map((k, i) => [k, values[i]]));
    }
    return { keys: list, values };
  };

  const {
    data = { keys: null, values: {} },
    isLoading: loadingKeys,
    error,
    refetch: refetchKeys,
  } = useQuery({
    queryKey: [
      'hyperbeam',
      selectedNodeUrl,
      open,
      usingCustom,
      customNodeUrl,
      customNodeError,
      processPath,
    ],
    queryFn: fetchKeysAndValues,
    enabled: open && !!selectedNodeUrl && !(usingCustom && (!customNodeUrl || !!customNodeError)),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Set fetchError if error is present, but only in an effect to avoid infinite re-render
  useEffect(() => {
    if (atSlotError) setFetchError(atSlotError.message);
    else if (currentSlotError) setFetchError(currentSlotError.message);
    else if (error) setFetchError(error.message);
  }, [atSlotError, currentSlotError, error]);

  return {
    atSlot: atSlotData ?? null,
    currentSlot: currentSlotData ?? null,
    atSlotLoading,
    currentSlotLoading,
    loadingKeys,
    fetchError: fetchError || (error ? error.message : null),
    nodeSwitching,
    setNodeSwitching,
    refetchSlots: () => { refetchAtSlot(); refetchCurrentSlot(); },
    setFetchError,
    keys: (data && typeof data === 'object' && 'keys' in (data as any)) ? (data as any).keys as string[] : null,
    values: (data && typeof data === 'object' && 'values' in (data as any)) ? (data as any).values as Record<string, any> : {},
    refetchKeys,
  }
} 