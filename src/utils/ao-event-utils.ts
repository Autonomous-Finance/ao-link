import { type AoEvent } from "@/services/aoscan"

import { parseUtcString } from "./date-utils"

export type NormalizedAoEvent = {
  id: string
  type: "Message" | "Process" | "Checkpoint" | "Assignment"
  to: string
  from: string
  blockHeight: number
  schedulerId: string
  created: Date
  action: string
  tags?: Record<string, any>
  cursor?: string
}

export function normalizeAoEvent(event: AoEvent): NormalizedAoEvent {
  const { owner_address, id, tags_flat, height, created_at, target } = event
  const { Action, Type, Scheduler } = tags_flat
  //
  const type = Type as NormalizedAoEvent["type"]
  const blockHeight = height
  const forwardedFor = tags_flat["Forwarded-For"]
  const fromProcess = tags_flat["From-Process"]
  const from = forwardedFor || fromProcess || owner_address
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

export type TokenEvent = {
  id: string
  type: "Message"
  created: Date
  action: string
  sender: string
  recipient: string
  amount: number
  tokenId: string
}

export function normalizeTokenEvent(event: AoEvent): TokenEvent {
  const { owner_address, id, tags_flat, created_at, target } = event
  const { Action, Type } = tags_flat
  //
  const type = Type as "Message"
  const forwardedFor = tags_flat["Forwarded-For"]
  const fromProcess = tags_flat["From-Process"]
  const from = forwardedFor || fromProcess || owner_address
  const action = Action
  const created = parseUtcString(created_at)
  const to = target.trim()
  const { tags } = normalizeTags(tags_flat)

  let sender
  let recipient
  let tokenId
  let amount = 0

  if (action === "Debit-Notice") {
    amount = -Number(tags["Quantity"])
    sender = to
    recipient = tags["Recipient"]
    tokenId = from
  } else if (action === "Credit-Notice") {
    amount = Number(tags["Quantity"])
    sender = tags["Sender"]
    recipient = to
    tokenId = from
  } else if (action === "Transfer") {
    amount = -Number(tags["Quantity"])
    sender = from
    recipient = tags["Recipient"]
    tokenId = to
  } else {
    throw new Error(`Unknown action: ${action}`)
  }

  return {
    id,
    type,
    created,
    action,
    sender,
    recipient,
    amount,
    tokenId,
  }
}
