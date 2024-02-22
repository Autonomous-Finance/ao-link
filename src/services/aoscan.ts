import { supabase } from "@/lib/supabase"
import { FilterOption } from "@/types"

export interface AoEvent {
  owner: string
  id: string
  tags_flat: Record<string, any>
  target: string
  owner_address: string
  height: number
  created_at: string
}

export const targetEmptyValue = "                                           "

export async function getLatestAoEvents(
  pageLimit: number = 1000,
  filter?: FilterOption,
): Promise<AoEvent[]> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })

    if (filter === "process") {
      supabaseRq = supabaseRq.eq("target", targetEmptyValue)
    } else if (filter === "message") {
      supabaseRq = supabaseRq.neq("target", targetEmptyValue)
    }

    supabaseRq = supabaseRq.range(0, pageLimit - 1).returns<AoEvent[]>()

    const { data } = await supabaseRq

    if (!data) return []

    return data
  } catch (error) {
    return []
  }
}

export async function getAoEventsForBlock(
  blockHeight: string,
): Promise<AoEvent[] | null> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })
      .eq("height", blockHeight)

    const { data } = await supabaseRq
    if (data) {
      return data as AoEvent[]
    }

    return null
  } catch (error) {
    return null
  }
}

export async function getAoEventsForOwner(
  ownerId: string,
  limit?: number,
): Promise<AoEvent[] | null> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })
      .eq("owner_address", ownerId)

    if (limit) {
      supabaseRq = supabaseRq.range(0, limit - 1)
    }

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
): Promise<AoEvent[]> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })
      .eq("target", processId)
      .range(0, 9)

    const { data } = await supabaseRq

    if (data) {
      return data as AoEvent[]
    }

    return []
  } catch (error) {
    console.error(error)
    return []
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
