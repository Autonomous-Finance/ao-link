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
// tags: [{ name: "From-Process", values: [$entityId] }]
// count

const getOutgoingMessagesQuery = gql`
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

      tags: [{ name: "SDK", values: ["aoconnect"] }]
      owners: [$entityId]
    ) {
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
  }
`

export async function getOutgoingMessages(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  entityId: string,
): Promise<[number, NormalizedAoEvent[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(getOutgoingMessagesQuery, {
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

// { name: "owner_address", values: [$entityId] }
// { name: "target", values: [$entityId] }
// { name: "Forwarded-For", values: [$entityId] }
// { name: "Pushed-For", values: [$entityId] }
// count

const getIncomingMessagesQuery = gql`
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
  }
`

export async function getIncomingMessages(
  limit = 100,
  cursor = "",
  ascending: boolean,
  //
  entityId: string,
): Promise<[number, NormalizedAoEvent[]]> {
  try {
    const result = await goldsky
      .query<TransactionsResponse>(getIncomingMessagesQuery, {
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
