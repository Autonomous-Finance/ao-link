import React, { memo } from "react"

import { EntityMessagesTable } from "@/app/entity/[slug]/EntityMessagesTable"
import { getResultingMessages } from "@/services/messages-api"
import { AoMessage } from "@/types"

type Props = {
  entityId: string
  messageId: string
  open: boolean
  onCountReady?: (count: number) => void
  onDataReady?: (data: AoMessage[]) => void
}

function BaseResultingMessages(props: Props) {
  const { messageId, entityId, open, onCountReady, onDataReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <EntityMessagesTable
      entityId={entityId}
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getResultingMessages(
          pageSize,
          lastRecord?.cursor,
          ascending,
          messageId,
        )

        if (count && onCountReady) {
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
export const ResultingMessages = memo(BaseResultingMessages)
