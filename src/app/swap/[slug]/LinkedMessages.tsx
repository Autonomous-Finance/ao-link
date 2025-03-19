import React, { memo } from "react"

import { EntityMessagesTable } from "@/app/entity/[slug]/EntityMessagesTable"
import { getMessageById, getLinkedMessages } from "@/services/messages-api"
import { AoMessage } from "@/types"

type Props = {
  pushedFor?: string
  messageId: string
  onCountReady?: (count: number) => void
  onDataReady?: (data: AoMessage[]) => void
}

function BaseLinkedMessages(props: Props) {
  const { pushedFor, messageId, onCountReady, onDataReady } = props

  const pageSize = 25

  return (
    <EntityMessagesTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        let [count, records] = await getLinkedMessages(
          pageSize,
          lastRecord?.cursor,
          ascending,
          pushedFor || messageId,
        )

        if (pushedFor) {
          records = records.filter((msg) => msg.id !== messageId)
          const pushedForMsg = await getMessageById(pushedFor)
          if (pushedForMsg) {
            records.push(pushedForMsg as AoMessage)
          }
        }

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
export const LinkedMessages = memo(BaseLinkedMessages)
