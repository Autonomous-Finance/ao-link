import { type AoEvent } from "@/services/aoscan"

import { parseUtcString } from "./date-utils"

export type NormalizedAoEvent = {
  id: string
  type: "Message" | "Process" | "Checkpoint"
  to: string
  from: string
  blockHeight: number
  schedulerId: string
  created: Date
  action: string
}

export function normalizeAoEvent(event: AoEvent): NormalizedAoEvent {
  const { owner_address, id, tags_flat, height, created_at, target } = event
  const { Action, Type, Scheduler } = tags_flat
  //
  const type = Type as NormalizedAoEvent["type"]
  const blockHeight = height
  const forwardedFor = tags_flat["Forwarded-For"]
  const from = forwardedFor || owner_address
  const schedulerId = Scheduler
  const action = Action
  const created = parseUtcString(created_at)
  const to = target.trim()

  return {
    id,
    type,
    from,
    to,
    blockHeight,
    schedulerId,
    created,
    action,
  }
}

export function normalizeTags(tags: Record<string, any>) {
  const { Tags, ...rest } = tags

  let normalizedTags = Object.assign({}, tags)

  try {
    if (Tags) {
      normalizedTags = { ...rest, ...JSON.parse(Tags) }
    }
  } catch {}

  const pushedFor = normalizedTags["Pushed-For"]

  delete normalizedTags["Data-Protocol"]
  delete normalizedTags["Variant"]
  delete normalizedTags["Type"]
  delete normalizedTags["Pushed-For"]
  delete normalizedTags["Ref_"]

  return { tags: normalizedTags, pushedFor }
}
