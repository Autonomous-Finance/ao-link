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

export interface Process {
  id: string
  sdk: string
  name: string
  type: string
  module: string
  variant: string
  app_name: string
  scheduler: string
  aos_version: string
  content_type: string
  data_protocol: string
  incoming_messages: number
  latest_message: string
  created_at: string
}

export interface Module {
  id: string
  type: string
  variant: string
  content_type: string
  memory_limit: string
  compute_limit: number
  data_protocol: string
  module_format: string
  input_encoding: string
  output_encoding: string
  created_at: string
  processes: number
  incoming_messages: number
  process_ids: string[]
}

export const targetEmptyValue = "                                           "

export async function getLatestAoEvents(
  limit = 1000,
  skip = 0,
  filter?: FilterOption,
  blockHeight?: number,
  ownerId?: string,
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

    if (blockHeight) {
      supabaseRq.eq("height", blockHeight)
    }

    if (ownerId) {
      supabaseRq.eq("owner_address", ownerId)
    }

    supabaseRq = supabaseRq.range(skip, skip + limit - 1).returns<AoEvent[]>()

    const { data } = await supabaseRq

    if (!data) return []

    return data
  } catch (error) {
    return []
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

export async function getProcessById(id: string) {
  const { data, error } = await supabase
    .from("processes")
    .select("*")
    .eq("id", id)
    .returns<Process[]>()

  if (error || !data) {
    console.error(error)
    return null
  }

  return data[0]
}

export async function getProcesses(
  limit = 1000,
  skip = 0,
  moduleId?: string,
  orderBy = "incoming_messages",
  ascending = false,
) {
  let supabaseRq = supabase
    .from("processes")
    .select("*")
    .order(orderBy, { ascending, nullsFirst: ascending })

  if (moduleId) {
    supabaseRq = supabaseRq.eq("module", moduleId)
  }

  const { data, error } = await supabaseRq
    .range(skip, skip + limit - 1)
    .returns<Process[]>()

  if (error || !data) {
    console.error(error)
    return []
  }

  return data
}

export async function getModuleById(id: string) {
  const { data, error } = await supabase
    .from("modules_extended")
    .select("*")
    .eq("id", id)
    .returns<Module[]>()

  if (error || !data) {
    console.error(error)
    return null
  }

  return data[0]
}

export async function getModules(
  limit = 1000,
  skip = 0,
  orderBy = "incoming_messages",
  ascending = false,
) {
  const { data, error } = await supabase
    .from("modules_extended")
    .select("*")
    .order(orderBy, { ascending, nullsFirst: ascending })
    .range(skip, skip + limit - 1)
    .returns<Module[]>()

  if (error || !data) {
    console.error(error)
    return []
  }

  return data
}
