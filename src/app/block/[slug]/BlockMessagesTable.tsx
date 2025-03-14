import React, { memo } from "react"

import { EntityMessagesTable } from "@/app/entity/[slug]/EntityMessagesTable"
import { getMessagesForBlock } from "@/services/messages-api"

type EntityMessagesProps = {
  blockHeight: number
  open: boolean
  onCountReady?: (count: number) => void
}

function BaseBlockMessagesTable(props: EntityMessagesProps) {
  const { blockHeight, open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <EntityMessagesTable
      allowTypeFilter
      hideBlockColumn
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getMessagesForBlock(
          pageSize,
          lastRecord?.cursor,
          ascending,
          blockHeight,
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}

export const BlockMessagesTable = memo(BaseBlockMessagesTable)
