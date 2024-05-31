import React from "react"

import { getIncomingMessages } from "@/services/messages-api"

import { EntityMessagesTable } from "./EntityMessagesTable"

type EntityMessagesProps = {
  entityId: string
  open: boolean
}

export function IncomingMessagesTable(props: EntityMessagesProps) {
  const { entityId, open } = props

  const pageSize = 10

  if (!open) return null

  return (
    <EntityMessagesTable
      entityId={entityId}
      pageSize={pageSize}
      fetchFunction={async (offset, ascending) => {
        const result = await getIncomingMessages(
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
