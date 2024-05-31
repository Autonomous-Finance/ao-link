import { gql } from "urql"

import { supabase } from "@/lib/supabase"

import { NormalizedAoEvent, normalizeAoEvent } from "@/utils/ao-event-utils"

import {
  TransactionsResponse,
  parseNormalizedAoEvent,
} from "@/utils/arweave-utils"

import { AoEvent } from "./aoscan"

import { goldsky } from "./graphql-client"

// TODO
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

const getOutgoingMessagesQuery = gql`
  query ($entityId: String!, $limit: Int!, $ascending: SortOrder!) {
    transactions(
      tags: [{ name: "From-Process", values: [$entityId] }]
      sort: $ascending
      first: $limit
    ) {
      count
      edges {
        cursor
        node {
          id
          recipient
          owner {
            address
          }
          tags {
            name
            value
          }
          block {
            id
            timestamp
            height
          }
          bundledIn {
            id
          }
        }
      }
    }
  }
`

export async function getOutgoingMessages(
  limit = 100,
  skip = 0,
  entityId: string,
  ascending: boolean,
): Promise<[number, NormalizedAoEvent[]]> {
  if (skip > 0) return [0, []] // TODO
  try {
    const result = await goldsky
      .query<TransactionsResponse>(getOutgoingMessagesQuery, {
        entityId,
        limit,
        // skip,
        ascending: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
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

// { name: "owner_address", values: [$entityId] }
// { name: "target", values: [$entityId] }
// { name: "Forwarded-For", values: [$entityId] }
// { name: "Pushed-For", values: [$entityId] }

const getIncomingMessagesQuery = gql`
  query ($entityId: String!, $limit: Int!, $ascending: SortOrder!) {
    transactions(
      sort: $ascending
      recipients: [$entityId]

      first: $limit
    ) {
      edges {
        cursor
        node {
          id
          recipient
          owner {
            address
          }
          tags {
            name
            value
          }
          block {
            id
            timestamp
            height
          }
          bundledIn {
            id
          }
        }
      }
    }
  }
`

export async function getIncomingMessages(
  limit = 100,
  skip = 0,
  entityId: string,
  ascending: boolean,
): Promise<[number, NormalizedAoEvent[]]> {
  if (skip > 0) return [0, []] // TODO
  try {
    const result = await goldsky
      .query<TransactionsResponse>(getIncomingMessagesQuery, {
        entityId,
        limit,
        // skip,
        ascending: ascending ? "HEIGHT_ASC" : "HEIGHT_DESC",
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
