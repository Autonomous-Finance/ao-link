import React, { memo } from "react"

import { getOutgoingMessages } from "@/services/messages-api"

import { AoMessage } from "@/types"

import { EntityMessagesTable } from "./EntityMessagesTable"

type EntityMessagesProps = {
  entityId: string
  open: boolean
  onCountReady?: (count: number) => void
  isProcess?: boolean
  onDataReady?: (data: AoMessage[]) => void
}

function BaseOutgoingMessagesTable(props: EntityMessagesProps) {
  const { entityId, open, onCountReady, isProcess, onDataReady } = props

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
          isProcess,
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        if (onDataReady) {
          onDataReady(records)
        }

        return records
      }}
    />
  )
}

// TODO FIXME
export const OutgoingMessagesTable = memo(BaseOutgoingMessagesTable)
