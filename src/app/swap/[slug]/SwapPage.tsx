import { Stack, Tooltip, Typography } from "@mui/material"

import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useMemo, useState } from "react"

import { useParams } from "react-router-dom"

import { EntityBlock } from "@/components/EntityBlock"
import { IdBlock } from "@/components/IdBlock"

import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { SectionInfo } from "@/components/SectionInfo"
import { Subheading } from "@/components/Subheading"

import { getMessageById, getResultingMessages } from "@/services/messages-api"
import { AoMessage, Tag } from "@/types"
import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"
import { isArweaveId } from "@/utils/utils"
import { result } from "@permaweb/aoconnect"
import { TokenAmountSection } from "@/components/TokenAmountSection"
import { useTokenInfo } from "@/hooks/useTokenInfo"

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
  lp: string
  amm: string
  quantityIn: string
  quantityOut: string
  feeBps: number
  totalFee: string
}

const getResultingMessageByTags = (resultingMessages: any[], tags: [string, string][]) => {
  return resultingMessages.find((m) => {
    const { Tags } = m
    const requiredTags = new Map(tags)
    return [...requiredTags].every(([key, value]) =>
      Tags.some(({ name, value: tagValue }: Tag) => name === key && tagValue === value),
    )
  })
}

const getTagValue = (tags: Tag[], tagName: string): string =>
  tags.find((tag: Tag) => tag.name === tagName)?.value ?? ""

export function SwapPage() {
  const { messageId = "" } = useParams()

  const [swapLoading, setSwapLoading] = useState<boolean>(true)
  const [swapData, setSwapData] = useState<Swap | undefined>(undefined)

  const tokenInInfo = useTokenInfo(swapData?.tokenIn ?? "")
  const tokenOutInfo = useTokenInfo(swapData?.tokenOut ?? "")

  const isValidId = useMemo(() => isArweaveId(String(messageId)), [messageId])

  const {
    data: message,
    // isLoading,
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
      // A - GET CREDIT NOTICE TO LP
      // Get resulting messages from original message
      const { Messages: originalResultingMessages } = await result({
        message: transferInMessage.id,
        process: transferInMessage.to,
      })
      // Get resulting Credit Notice message from the token in to the LP
      const creditNotice = getResultingMessageByTags(originalResultingMessages, [
        ["Action", "Credit-Notice"],
        ["X-Action", "Swap"],
      ])
      // If no credit notice message is sent to the LP => not a swap
      if (!creditNotice) throw new Error("No credit notice message sent to LP")
      // Get credit notice message ID from graph using message ref
      const creditNoticeRef = getTagValue(creditNotice.Tags, "Reference")
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
        to: lpProcessId,
      } = creditNoticeMessage

      // B - GET TRANSFER TO TOKEN OUT
      // Get resulting messages from credit notice to the AMM
      const { Messages: creditNoticeResultingMessages } = await result({
        message: creditNoticeMessageId,
        process: lpProcessId,
      })
      // Get resulting Transfer message from the AMM to the token out
      const transferOut = getResultingMessageByTags(creditNoticeResultingMessages, [
        ["Action", "Transfer"],
        ["X-Action", "Swap-Output"],
      ])
      // Get resulting Order Confirmation from the pool to the AMM
      const orderConfirmation = getResultingMessageByTags(creditNoticeResultingMessages, [
        ["Action", "Order-Confirmation"],
      ])
      const totalFee = getTagValue(orderConfirmation.Tags, "Total-Fee")

      // If no transfer message is sent from the AMM => not a swap
      if (!transferOut) throw new Error("No transfer message sent from AMM to token out")
      // Get transfer message ID from graph using message ref
      const transferRef = getTagValue(transferOut.Tags, "Reference")
      const feeBpsStr = getTagValue(transferOut.Tags, "X-Fee-Bps")
      const [, [transferOutMessage]] = await getResultingMessages(1, "", true, "", lpProcessId, [
        transferRef,
      ])
      const {
        id: transferOutMessageId,
        tags: { Quantity: quantityOut },
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
        lp: lpProcessId,
        amm: orderConfirmation.Target,
        quantityIn,
        quantityOut,
        feeBps: Number(feeBpsStr),
        totalFee,
      }

      setSwapData(data)
    } catch (e) {
      console.error(e)
    } finally {
      setSwapLoading(false)
    }
  }

  useEffect(() => {
    if (!!message) {
      getSwap(message)
    }
  }, [message])

  if (swapLoading) {
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
    lp,
    amm,
    quantityIn,
    quantityOut,
    feeBps,
    totalFee,
  } = swapData

  return (
    <React.Fragment key={messageId}>
      <Stack component="main" gap={6} paddingY={4}>
        <Subheading type="SWAP" value={<IdBlock label={messageId} />} />
        <Stack gap={4}>
          <SectionInfo title="Swapper" value={<EntityBlock entityId={initiator} />} />
          <SectionInfo title="AMM" value={<EntityBlock entityId={amm} />} />
          <SectionInfo title="Liquidity Pool" value={<EntityBlock entityId={lp} />} />
          <SectionInfo title="Token In" value={<EntityBlock entityId={tokenIn} />} />
          <SectionInfo title="Token Out" value={<EntityBlock entityId={tokenOut} />} />
          <SectionInfo
            title="Fee"
            value={
              <Tooltip title={`${feeBps} bps`}>
                <span>{feeBps * 0.01}%</span>
              </Tooltip>
            }
          />
          <TokenAmountSection tokenInfo={tokenInInfo} amount={quantityIn} label="Quantity In" />
          <TokenAmountSection tokenInfo={tokenOutInfo} amount={quantityOut} label="Quantity Out" />
          <TokenAmountSection tokenInfo={tokenInInfo} amount={totalFee} label="Total Fee" />
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
