import { AoEvent } from "@/services/aoscan"
import { parseUtcString } from "./date-utils"

export type NormalizedAoEvent = {
  // id: string
  type: "Message" | "Process"
  messageId: string
  processId: string
  owner: string
  blockHeight: number
  schedulerId: string
  created: Date
  action: string
}

export function normalizeAoEvent(event: AoEvent): NormalizedAoEvent {
  const { owner, id, tags_flat, height, created_at, target } = event
  const { Action, Type, Variant } = tags_flat
  //
  const type = Type as NormalizedAoEvent["type"]
  const blockHeight = height
  const schedulerId = Variant
  const action = Action
  const created = parseUtcString(created_at)
  //
  const processId = type === "Message" ? target : id
  const messageId = type === "Message" ? id : ""

  return {
    type,
    messageId,
    owner,
    processId,
    blockHeight,
    schedulerId,
    created,
    action,
  }
}
