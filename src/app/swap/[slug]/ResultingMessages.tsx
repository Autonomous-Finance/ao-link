import { MessageResult } from "@permaweb/aoconnect/dist/lib/result"
import React, { memo, useMemo } from "react"

import { EntityMessagesTable } from "@/app/entity/[slug]/EntityMessagesTable"
import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { getResultingMessages } from "@/services/messages-api"
import { AoMessage } from "@/types"
import { parseAoMessageFromCU } from "@/utils/arweave-utils"

type Props = {
  message: AoMessage
  onCountReady?: (count: number) => void
  onDataReady?: (data: AoMessage[]) => void
  computeResult: MessageResult | null | undefined
}

function BaseResultingMessages(props: Props) {
  const { message, onCountReady, onDataReady, computeResult } = props

  const pageSize = 100

  const computeResultMsgs = useMemo(
    () =>
      computeResult && computeResult.Messages
        ? computeResult.Messages.map(parseAoMessageFromCU)
        : [],
    [computeResult],
  )

  // undefined = loading
  // null = not found
  if (computeResult === undefined) return <LoadingSkeletons />

  return (
    <EntityMessagesTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        let [count, records] = await getResultingMessages(
          pageSize,
          lastRecord?.cursor,
          ascending,
          message?.tags["Pushed-For"] || message.id,
          message.to,
          computeResultMsgs.map((msg) => msg.tags["Reference"] || msg.tags["Ref_"]),
          !!computeResultMsgs[0]?.tags["Ref_"],
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        if (onDataReady) {
          // onDataReady(records)
          onDataReady([])
        }

        return records
      }}
    />
  )
}

// TODO FIXME
export const ResultingMessages = memo(BaseResultingMessages)
