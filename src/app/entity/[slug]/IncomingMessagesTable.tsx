import React from "react"

import { getIncomingMessages } from "@/services/messages-api"

import { EntityMessagesTable } from "./EntityMessagesTable"

type EntityMessagesProps = {
  entityId: string
  open: boolean
}

export function IncomingMessagesTable(props: EntityMessagesProps) {
  const { entityId, open } = props

  const pageSize = 25

  if (!open) return null

  return (
    <EntityMessagesTable
      entityId={entityId}
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getIncomingMessages(
          pageSize,
          lastRecord?.cursor,
          ascending,
          entityId,
        )

        return records
      }}
    />
  )
}
