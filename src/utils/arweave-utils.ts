import { NormalizedAoEvent } from "./ao-event-utils"

export type Tag = {
  name: string
  value: string
}

export type Owner = {
  address: string
  key?: string
}

export type Block = {
  id?: string
  timestamp: number
  height: number
  previous?: string
}

export type TransactionNode = {
  id: string
  anchor?: string
  ingested_at: number
  signature?: string
  recipient: string
  owner: Owner
  fee?: {
    winston: string
    ar: string
  }
  quantity?: {
    winston: string
    ar: string
  }
  data?: {
    size?: number
    type?: string
  }
  tags: Tag[]
  block: Block
  parent?: {
    id: string
  }
  bundledIn?: {
    id: string
  }
}

export type TransactionEdge = {
  cursor: string
  node: TransactionNode
}

export type TransactionsResponse = {
  transactions: {
    count: number | undefined
    edges: TransactionEdge[]
  }
}

export function parseNormalizedAoEvent(
  edge: TransactionEdge,
): NormalizedAoEvent {
  const { node, cursor } = edge

  const tags = node.tags.reduce((acc: Record<string, string>, tag: Tag) => {
    acc[tag.name] = tag.value
    return acc
  }, {})

  const type = tags["Type"] as NormalizedAoEvent["type"]
  const blockHeight = node.block ? node.block.height : 0
  const from =
    tags["Forwarded-For"] || tags["From-Process"] || node.owner.address
  const schedulerId = tags["Scheduler"]
  const action = tags["Action"]
  const created = new Date(
    (node.block ? node.block.timestamp : node.ingested_at || 0) * 1000,
  )
  const to = node.recipient.trim()

  return {
    id: node.id,
    type,
    from,
    to,
    blockHeight,
    schedulerId,
    created,
    action,
    tags,
    cursor,
  }
}
