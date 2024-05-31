import React from "react"

import { getOutgoingMessages } from "@/services/messages-api"

import { EntityMessagesTable } from "./EntityMessagesTable"

type EntityMessagesProps = {
  entityId: string
  open: boolean
}

export function OutgoingMessagesTable(props: EntityMessagesProps) {
  const { entityId, open } = props

  const pageSize = 10

  if (!open) return null

  return (
    <EntityMessagesTable
      entityId={entityId}
      pageSize={pageSize}
      fetchFunction={async (offset, ascending) => {
        const result = await getOutgoingMessages(
          pageSize,
          offset,
          entityId,
          ascending,
        )

        return result[1]
      }}
    />
  )
}
