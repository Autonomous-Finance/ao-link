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
  tokenIn: string
  lp: string
  tokenOut: string
  initiator: string
  ammFactory: string
  quantityIn: string
  feeBps: number
  quantityOut?: string
  CreditNoticeTokenInMessageId?: string
  transferOutMessageId?: string
  totalFee?: string
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
  const [failingMessage, setFailingMessage] = useState<AoMessage | undefined>(undefined)

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
      // If transfer in message has no Swap tag => not a swap
      if (
        transferInMessage.tags["X-Action"] !== "Swap" ||
        transferInMessage.tags["Action"] !== "Transfer"
      )
        throw new Error("Message does not initiate a swap")
      // Get quantity in and LP id
      const { Quantity: quantityIn, Recipient: lpProcessId } = transferInMessage.tags

      // GET LP & AMM data
      const lpProcess = await getMessageById(lpProcessId)
      // If process data is not found, throw error
      if (!lpProcess) throw new Error("LP process not found")
      const ammFactory = lpProcess.tags["AMM-Factory"]
      const tokenOut =
        lpProcess.tags["Token-A"] === transferInMessage.to
          ? lpProcess.tags["Token-B"]
          : lpProcess.tags["Token-A"]
      const feeBpsStr = lpProcess.tags["Fee-Bps"]

      // Save basic swap data
      setSwapData({
        ingestedAt: transferInMessage.ingestedAt,
        blockHeight: transferInMessage?.blockHeight,
        transferInMessageId: transferInMessage.id,
        tokenIn: transferInMessage.to,
        initiator: transferInMessage.from,
        quantityIn,
        tokenOut,
        lp: lpProcessId,
        ammFactory,
        feeBps: Number(feeBpsStr),
      })
      // Stop loading swap in the UI for the sake of speed
      // i.e. We do not wait for resulting messages to be fetched
      setSwapLoading(false)

      // GET CREDIT NOTICE TO LP
      // Get resulting messages from transfer in message
      const transferInResults = await result({
        message: transferInMessage.id,
        process: transferInMessage.to,
      })
      // Check success
      // TODO: solve the MessageResult type issue with lowercase error
      if (!!transferInResults?.Error || !!transferInResults?.error) {
        setFailingMessage(transferInMessage)
        throw new Error("Swap fails at initial transfer message")
      }
      // Get resulting Credit Notice message from the token in to the LP
      const CreditNoticeTokenIn = getResultingMessageByTags(transferInResults.Messages, [
        ["Action", "Credit-Notice"],
        ["X-Action", "Swap"],
      ])

      // Get credit notice message ID from graph using message ref
      const CreditNoticeTokenInRef = getTagValue(CreditNoticeTokenIn.Tags, "Reference")
      const [, [CreditNoticeTokenInMessage]] = await getResultingMessages(
        1,
        "",
        true,
        "",
        transferInMessage.to,
        [CreditNoticeTokenInRef],
      )
      const { id: CreditNoticeTokenInMessageId } = CreditNoticeTokenInMessage
      // Update swap data with credit notice message id
      setSwapData((prev) => {
        if (!prev) return
        return {
          ...prev,
          CreditNoticeTokenInMessageId,
        }
      })

      // GET TRANSFER TO TOKEN OUT
      // Get resulting messages from credit notice to the AMM
      const CreditNoticeTokenInResult = await result({
        message: CreditNoticeTokenInMessageId,
        process: lpProcessId,
      })
      // Check success
      // TODO: solve the MessageResult type issue with lowercase error
      if (!!CreditNoticeTokenInResult?.Error || !!CreditNoticeTokenInResult?.error) {
        setFailingMessage(CreditNoticeTokenInMessage)
        throw new Error("Swap fails at credit notice message for token in")
      }
      // Get resulting Transfer message from the AMM to the token out
      const transferOut = getResultingMessageByTags(CreditNoticeTokenInResult.Messages, [
        ["Action", "Transfer"],
        ["X-Action", "Swap-Output"],
      ])
      // Get resulting Order Confirmation from the pool to the AMM
      const orderConfirmation = getResultingMessageByTags(CreditNoticeTokenInResult.Messages, [
        ["Action", "Order-Confirmation"],
      ])
      const totalFee = getTagValue(orderConfirmation.Tags, "Total-Fee")
      // Update swap data with total fee
      setSwapData((prev) => {
        if (!prev) return
        return {
          ...prev,
          totalFee,
        }
      })

      // Get transfer message ID from graph using message ref
      const transferRef = getTagValue(transferOut.Tags, "Reference")
      const [, [transferOutMessage]] = await getResultingMessages(1, "", true, "", lpProcessId, [
        transferRef,
      ])
      const {
        id: transferOutMessageId,
        tags: { Quantity: quantityOut },
      } = transferOutMessage

      setSwapData((prev) => {
        if (!prev) return
        return {
          ...prev,
          transferOutMessageId,
          quantityOut,
        }
      })

      // GET CREDIT NOTICE TO RECIPIENT
      // Get resulting messages from token out to swapper
      const transferOutResult = await result({
        message: transferOutMessageId,
        process: tokenOut,
      })
      // Check success
      // TODO: solve the MessageResult type issue with lowercase error
      if (!!transferOutResult?.Error || !!transferOutResult?.error) {
        setFailingMessage(transferOutMessage)
        throw new Error("Swap fails at transfer from lp amm to token out")
      }
    } catch (e) {
      console.error("GET SWAP ERROR", e)
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
    ammFactory,
    quantityIn,
    feeBps,
  } = swapData

  return (
    <React.Fragment key={messageId}>
      <Stack component="main" gap={6} paddingY={4}>
        <Subheading type="SWAP" value={<IdBlock label={messageId} />} />
        <Stack gap={4}>
          <SectionInfo title="Swapper" value={<EntityBlock entityId={initiator} />} />
          <SectionInfo title="AMM Factory" value={<EntityBlock entityId={ammFactory} />} />
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
          <TokenAmountSection
            tokenInfo={tokenOutInfo}
            amount={swapData?.quantityOut ?? "0"}
            label="Quantity Out"
            loading={!swapData?.quantityOut}
          />
          <TokenAmountSection
            tokenInfo={tokenInInfo}
            amount={swapData?.totalFee ?? "0"}
            label="Total Fee"
            loading={!swapData?.totalFee}
          />
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
