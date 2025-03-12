import { Box, CircularProgress, Paper, Stack, Tabs, Tooltip, Typography } from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result"
import { useQuery } from "@tanstack/react-query"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import { Navigate, useParams, useSearchParams } from "react-router-dom"

import { ComputeResult } from "./ComputeResult"
import { LinkedMessages } from "./LinkedMessages"
import { MessageData } from "./MessageData"
import { ResultingMessages } from "./ResultingMessages"
import { EntityBlock } from "@/components/EntityBlock"
import { ChartDataItem, Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"

import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"
import { TabWithCount } from "@/components/TabWithCount"
import { TagsSection } from "@/components/TagsSection"

import { getMessageById, getResultingMessages } from "@/services/messages-api"
import { AoMessage, Tag } from "@/types"
import { truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"
import { isArweaveId } from "@/utils/utils"
import { result } from "@permaweb/aoconnect"
import { prettifyResult } from "@/utils/ao-utils"

const defaultTab = "resulting"

interface Swap {
  originalTransaction: string
  tokenIn: string
  tokenOut: string
  initiator: string
  amm: string
  quantityIn: string
}

export function SwapPage() {
  const { messageId = "" } = useParams()

  const [swapLoading, setSwapLoading] = useState<boolean>(true)
  const [swapData, setSwapData] = useState<Swap | undefined>(undefined)

  const isValidId = useMemo(() => isArweaveId(String(messageId)), [messageId])

  const {
    data: message,
    isLoading,
    error,
  } = useQuery({
    enabled: Boolean(messageId) && isValidId,
    queryKey: ["message", messageId],
    queryFn: () => getMessageById(messageId),
  })

  const getSwap = async (originalMessage: AoMessage) => {
    try {
      // If original message has no Swap tag => not a swap
      if (originalMessage.tags["X-Action"] !== "Swap")
        throw new Error("Message does not initiate a swap")
      // Get resulting messages from original message
      const { Messages } = await result({
        message: originalMessage.id,
        process: originalMessage.to,
      })
      // Get resulting Credit Notice message from the token in to the AMM
      const creditNotice = Messages.find((m) => {
        const { Tags } = m
        const requiredTags = new Map([
          ["Action", "Credit-Notice"],
          ["X-Action", "Swap"],
        ])
        return [...requiredTags].every(([key, value]) =>
          Tags.some(({ name, value: tagValue }: Tag) => name === key && tagValue === value),
        )
      })
      // If no credit notice message is sent to the AMM => not a swap
      if (!creditNotice) throw new Error("No credit notice message sent to AMM")
      // Get credit notice message ID from graph using message ref
      const { value: creditNoticeRef } = creditNotice.Tags.find(
        (tag: Tag) => tag.name === "Reference",
      )
      const [count, [creditNoticeMessage]] = await getResultingMessages(1, "", true, "", originalMessage.to, [creditNoticeRef])
      console.log(`getResultingRecords creditNoticeMessage:`, creditNoticeMessage)
      const {
        tags: {
          Quantity: quantityIn,
        },
        to: ammProcessId,
      } = creditNoticeMessage

      const data: Swap = {
        originalTransaction: originalMessage.id,
        tokenIn: originalMessage.to,
        tokenOut: "",
        initiator: originalMessage.from,
        amm: ammProcessId,
        quantityIn,
      }

      setSwapData(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!!message) {
      getSwap(message)
    }
  }, [message])

  if (isLoading) {
    return <LoadingSkeletons />
  }

  if (!isValidId || error || !message) {
    return (
      <Stack component="main" gap={4} paddingY={4}>
        <Typography>{error?.message || "Message not found."}</Typography>
      </Stack>
    )
  }

  const { from, type, blockHeight, ingestedAt, to, systemTags, userTags } = message

  if (type === "Process") {
    return <Navigate to={`/entity/${messageId}`} />
  }

  return (
    <React.Fragment key={messageId}>
      <Stack component="main" gap={6} paddingY={4}>
        <Subheading type="SWAP" value={<IdBlock label={messageId} />} />
      </Stack>
    </React.Fragment>
  )
}
