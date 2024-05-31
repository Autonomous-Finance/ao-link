import { gql } from "urql"

import { supabase } from "@/lib/supabase"

import { NormalizedAoEvent } from "@/utils/ao-event-utils"

import {
  TransactionsResponse,
  parseNormalizedAoEvent,
} from "@/utils/arweave-utils"

import { AoEvent } from "./aoscan"

import { goldsky } from "./graphql-client"

// TODO
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

// { name: "owner_address", values: [$entityId] }
// { name: "target", values: [$entityId] }
// { name: "Forwarded-For", values: [$entityId] }
// { name: "Pushed-For", values: [$entityId] }

const messageFields = gql`
  fragment MessageFields on TransactionConnection {
    edges {
      cursor
      node {
        id
        recipient
        block {
          timestamp
          height
        }
        tags {
          name
          value
        }
        owner {
          address
        }
      }
    }
  }
`

const processIdentifier = `
  tags: [{ name: "From-Process", values: [$entityId] }]
`

const userIdentifier = `
  tags: [{ name: "SDK", values: ["aoconnect"] }]
  owners: [$entityId]
`

/**
 * WARN This query fails if both count and cursor are set
 */
const outgoingMessagesQuery = (
  includeCount = false,
  isProcess?: boolean,
) => gql`
  query (
    $entityId: String!
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor

      ${isProcess ? processIdentifier : userIdentifier}
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getOutgoingMessages(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  entityId: string,
  isProcess?: boolean,
): Promise<[number | undefined, NormalizedAoEvent[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(outgoingMessagesQuery(!cursor, isProcess), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        entityId,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseNormalizedAoEvent)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}

/**
 * WARN This query fails if both count and cursor are set
 */
const getIncomingMessagesQuery = (includeCount = false) => gql`
  query (
    $entityId: String!
    $limit: Int!
    $sortOrder: SortOrder!
    $cursor: String
  ) {
    transactions(
      sort: $sortOrder
      first: $limit
      after: $cursor

      recipients: [$entityId]
    ) {
      ${includeCount ? "count" : ""}
      ...MessageFields
    }
  }

  ${messageFields}
`

export async function getIncomingMessages(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  entityId: string,
): Promise<[number | undefined, NormalizedAoEvent[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(getIncomingMessagesQuery(!cursor), {
        limit,
        sortOrder: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
        cursor,
        //
        entityId,
      })
      .toPromise()
    const { data } = result

    if (!data) return [0, []]

    const { count, edges } = data.transactions
    const events = edges.map(parseNormalizedAoEvent)

    return [count, events]
  } catch (error) {
    return [0, []]
  }
}
