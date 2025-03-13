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
  blockHeight: number | null
  ingestedAt: Date
  transferInMessageId: string
  transferOutMessageId: string
  creditNoticeMessageId: string
  tokenIn: string
  tokenOut: string
  initiator: string
  amm: string
  quantityIn: string
  quantityOut: string
  recipient: string
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

  const getSwap = async (transferInMessage: AoMessage) => {
    try {
      setSwapLoading(true)
      // If original message has no Swap tag => not a swap
      if (transferInMessage.tags["X-Action"] !== "Swap")
        throw new Error("Message does not initiate a swap")
      // A - GET CREDIT NOTICE TO AMM
      // Get resulting messages from original message
      const { Messages: originalResultingMessages } = await result({
        message: transferInMessage.id,
        process: transferInMessage.to,
      })
      // Get resulting Credit Notice message from the token in to the AMM
      const creditNotice = originalResultingMessages.find((m) => {
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
      const [, [creditNoticeMessage]] = await getResultingMessages(
        1,
        "",
        true,
        "",
        transferInMessage.to,
        [creditNoticeRef],
      )
      const {
        id: creditNoticeMessageId,
        tags: { Quantity: quantityIn },
        to: ammProcessId,
      } = creditNoticeMessage

      // B - GET TRANSFER TO TOKEN OUT
      // Get resulting messages from credit notice to the AMM
      const { Messages: creditNoticeResultingMessages } = await result({
        message: creditNoticeMessageId,
        process: ammProcessId,
      })
      // Get resulting Transfer message from the AMM to the token out
      const transferOut = creditNoticeResultingMessages.find((m) => {
        const { Tags } = m
        const requiredTags = new Map([
          ["Action", "Transfer"],
          ["X-Action", "Swap-Output"],
        ])
        return [...requiredTags].every(([key, value]) =>
          Tags.some(({ name, value: tagValue }: Tag) => name === key && tagValue === value),
        )
      })
      // If no transfer message is sent from the AMM => not a swap
      if (!transferOut) throw new Error("No transfer message sent from AMM to token out")
      // Get transfer message ID from graph using message ref
      const { value: transferRef } = transferOut.Tags.find((tag: Tag) => tag.name === "Reference")
      const [, [transferOutMessage]] = await getResultingMessages(1, "", true, "", ammProcessId, [
        transferRef,
      ])
      const {
        id: transferOutMessageId,
        tags: { Quantity: quantityOut, Recipient: recipient },
        to: tokenOut,
      } = transferOutMessage

      const data: Swap = {
        ingestedAt: transferInMessage.ingestedAt,
        blockHeight: transferInMessage?.blockHeight,
        transferInMessageId: transferInMessage.id,
        creditNoticeMessageId,
        transferOutMessageId,
        tokenIn: transferInMessage.to,
        tokenOut,
        initiator: transferInMessage.from,
        amm: ammProcessId,
        quantityIn,
        quantityOut,
        recipient,
      }
      console.log(`data:`, data)

      setSwapData(data)
    } catch (e) {
      console.error(e)
    } finally {
      setSwapLoading(false)
    }
  }

  useEffect(() => {
    if (!!message) {
      console.log(`message:`, message)
      getSwap(message)
    }
  }, [message])

  if (isLoading) {
    return <LoadingSkeletons />
  }

  if (!isValidId || error || !swapData) {
    return (
      <Stack component="main" gap={4} paddingY={4}>
        <Typography>{error?.message || "Swap not found."}</Typography>
      </Stack>
    )
  }

  const {
    blockHeight,
    ingestedAt,
    transferInMessageId,
    creditNoticeMessageId,
    transferOutMessageId,
    tokenIn,
    tokenOut,
    initiator,
    amm,
    quantityIn,
    quantityOut,
    recipient,
  } = swapData

  return (
    <React.Fragment key={messageId}>
      <Stack component="main" gap={6} paddingY={4}>
        <Subheading type="SWAP" value={<IdBlock label={messageId} />} />
        <Stack gap={4}>
          <SectionInfo title="Initiator" value={<EntityBlock entityId={initiator} />} />
          <SectionInfo title="Recipient" value={<EntityBlock entityId={recipient} />} />
          <SectionInfo title="AMM" value={<EntityBlock entityId={amm} />} />
          <SectionInfo title="Token In" value={<EntityBlock entityId={tokenIn} />} />
          <SectionInfo title="Token Out" value={<EntityBlock entityId={tokenOut} />} />
          {/* <SectionInfo
            title="Quantity In"
            value={
              <Tooltip title={formatFullDate(ingestedAt)}>
                <span>{formatNumber(quantityIn)}</span>
              </Tooltip>
            }
          /> */}
          <SectionInfo
            title="Block Height"
            value={
              blockHeight === null ? (
                "Processing"
              ) : (
                <IdBlock
                  label={formatNumber(blockHeight)}
                  value={String(blockHeight)}
                  href={`/block/${blockHeight}`}
                />
              )
            }
          />
          <SectionInfo
            title="Seen at"
            value={
              ingestedAt === null ? (
                "Processing"
              ) : (
                <Tooltip title={formatFullDate(ingestedAt)}>
                  <span>{formatRelative(ingestedAt)}</span>
                </Tooltip>
              )
            }
          />
          <SectionInfo title="Result Type" value="JSON" />
        </Stack>
      </Stack>
    </React.Fragment>
  )
}
