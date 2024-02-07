import { supabase } from "@/lib/supabase"

export interface AoEvent {
  owner: string
  id: string
  tags_flat: Record<string, any>
  target: string
  owner_address: string
  height: number
  created_at: string
}

export async function getLatestAoEvents(): Promise<AoEvent[] | null> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })
      .range(0, 30)

    const { data } = await supabaseRq
    if (data) {
      return data as AoEvent[]
    }

    return null
  } catch (error) {
    return null
  }
}

export async function getLatestMessagesForProcess(
  processId: string,
): Promise<AoEvent[] | null> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })
      .eq("target", processId)
      .range(0, 10)

    const { data } = await supabaseRq

    if (data) {
      return data as AoEvent[]
    }

    return null
  } catch (error) {
    return null
  }
}

export function subscribeToEvents(callback: (data: AoEvent) => void) {
  const channel = supabase
    .channel("ao_events")
    .on<AoEvent>(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "ao_events" },
      (payload) => {
        callback(payload.new)
      },
    )
    .subscribe()

  return function unsubscribe() {
    supabase.removeChannel(channel)
  }
}

export async function getAoEventById(id: string): Promise<AoEvent | null> {
  const { data } = await supabase
    .from("ao_events")
    .select("owner,id,tags_flat,target,owner_address,height,created_at")
    .eq("id", id)

  if (data && data.length) {
    return data[0] as AoEvent
  }

  return null
}
