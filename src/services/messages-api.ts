import { supabase } from "@/lib/supabase"

import { NormalizedAoEvent, normalizeAoEvent } from "@/utils/ao-event-utils"

import { AoEvent } from "./aoscan"

export async function getMessagesByEntityId(
  limit = 1000,
  skip = 0,
  entityId: string,
  ascending: boolean,
): Promise<NormalizedAoEvent[]> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending })
      .or(
        `owner_address.eq.${entityId},target.eq.${entityId},tags_flat ->> Forwarded-For.eq.${entityId},tags_flat ->> From-Process.eq.${entityId},tags_flat ->> Pushed-For.eq.${entityId}`,
      )

    supabaseRq = supabaseRq.range(skip, skip + limit - 1).returns<AoEvent[]>()

    const { data } = await supabaseRq

    if (!data) return []

    return data.map(normalizeAoEvent)
  } catch (error) {
    return []
  }
}

export async function getTokenTransfers(
  limit = 1000,
  skip = 0,
  processId: string,
): Promise<AoEvent[]> {
  try {
    let supabaseRq

    supabaseRq = supabase
      .from("ao_events")
      .select("owner,id,tags_flat,target,owner_address,height,created_at")
      .order("created_at", { ascending: false })
      .or(
        `tags_flat ->> Action.eq.Credit-Notice,tags_flat ->> Action.eq.Debit-Notice,tags_flat ->> Action.eq.Transfer`,
      )
      .or(`owner_address.eq.${processId},target.eq.${processId}`)

    supabaseRq = supabaseRq.range(skip, skip + limit - 1).returns<AoEvent[]>()

    const { data } = await supabaseRq

    if (!data) return []

    return data
  } catch (error) {
    return []
  }
}
