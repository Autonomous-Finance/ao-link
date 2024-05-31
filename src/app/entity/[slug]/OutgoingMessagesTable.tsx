import React from "react"

import { getOutgoingMessages } from "@/services/messages-api"

import { EntityMessagesTable } from "./EntityMessagesTable"

type EntityMessagesProps = {
  entityId: string
  open: boolean
  onCountReady?: (count: number) => void
}

export function OutgoingMessagesTable(props: EntityMessagesProps) {
  const { entityId, open, onCountReady } = props

  const pageSize = 25

  if (!open) return null

  return (
    <EntityMessagesTable
      entityId={entityId}
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getOutgoingMessages(
          pageSize,
          lastRecord?.cursor,
          ascending,
          entityId,
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}
