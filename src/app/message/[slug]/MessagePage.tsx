"use client"

import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import React, { useEffect, useMemo, useState } from "react"

import { useParams } from "react-router-dom"

import { ComputeResult } from "./ComputeResult"
import { ResultingMessages } from "./ResultingMessages"
import { EntityBlock } from "@/components/EntityBlock"
import { ChartDataItem, Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"

import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"
import { TabWithCount } from "@/components/TabWithCount"
import { TagsSection } from "@/components/TagsSection"

import { getMessageById } from "@/services/messages-api"
import { AoMessage } from "@/types"
import { truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

export function MessagePage() {
  const { messageId } = useParams()

  const [message, setMessage] = useState<AoMessage | undefined | null>(null)

  useEffect(() => {
    if (!messageId) return

    getMessageById(messageId).then(setMessage)
  }, [messageId])

  const [data, setData] = useState<string>()

  useEffect(() => {
    if (!message) return

    if (message.type === "Checkpoint") {
      setData("Message too long")
    } else {
      fetch(`https://arweave.net/${message.id}`)
        .then((res) => res.text())
        .then(setData)
    }
  }, [message])

  const pushedFor = message?.tags["Pushed-For"]

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [pushedForMsg, setPushedForMsg] = useState<AoMessage>()

  useEffect(() => {
    if (pushedFor) {
      getMessageById(pushedFor).then(setPushedForMsg)
    }
  }, [pushedFor])

  const [resultingCount, setResultingCount] = useState<number>()
  const [resultingMessages, setResultingMessages] = useState<AoMessage[] | null>(null)

  const graphData = useMemo<ChartDataItem[] | null>(() => {
    const originatingMessage = pushedFor ? pushedForMsg : message

    if (!message || resultingMessages === null || !originatingMessage) return null

    const results: ChartDataItem[] = resultingMessages.map((x) => {
      const source_type = x.tags["From-Process"] === x.from ? "Process" : "User"
      const target_type = x.tags["From-Process"] === x.to ? "Process" : "User"

      return {
        highlight: message.id === x.id,
        id: x.id,
        source: `${source_type} ${truncateId(x.from)}`,
        source_id: x.from,
        target: `${target_type} ${truncateId(x.to)}`,
        target_id: x.to,
        type: "Cranked Message",
        action: x.tags["Action"] || "No Action Tag",
      }
    })

    const firstTargetType = resultingMessages.length === 0 ? "User" : "Process"

    return [
      {
        highlight: message.id === originatingMessage.id,
        id: originatingMessage.id,
        source: "User",
        source_id: originatingMessage.from,
        target: `${firstTargetType} ${truncateId(originatingMessage.to)}`,
        target_id: originatingMessage.to,
        type: "User Message",
        action: originatingMessage.tags["Action"] || "No Action Tag",
      },
      ...results,
    ]
  }, [resultingMessages, message, pushedForMsg, pushedFor])

  if (message === null) return <LoadingSkeletons />

  if (!messageId || !message) {
    return <div>Not Found</div>
  }

  const { from, type, blockHeight, created, to, systemTags, userTags } = message

  return (
    <React.Fragment key={messageId}>
      <Stack component="main" gap={6} paddingY={4}>
        <Subheading type="MESSAGE" value={<IdBlock label={messageId} />} />
        <Grid2 container spacing={{ xs: 2, lg: 12 }}>
          <Grid2 xs={12} lg={6}>
            <Stack gap={4}>
              <Paper sx={{ height: 428, width: 428 }}>
                {graphData === null ? (
                  <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                    <CircularProgress size={24} color="primary" />
                  </Stack>
                ) : graphData.length > 0 ? (
                  <Graph data={graphData} />
                ) : (
                  <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                    <Typography variant="body2" color="text.secondary">
                      Nothing to see here.
                    </Typography>
                  </Stack>
                )}
              </Paper>
              <SectionInfoWithChip title="Type" value={type} />
              <SectionInfo title="From" value={<EntityBlock entityId={from} />} />
              {to && <SectionInfo title="To" value={<EntityBlock entityId={to} />} />}
              {pushedFor && (
                <SectionInfo
                  title="Pushed for"
                  value={
                    <IdBlock
                      label={truncateId(pushedFor)}
                      value={pushedFor}
                      href={`/message/${pushedFor}`}
                    />
                  }
                />
              )}
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
                title="Created"
                value={
                  created === null ? (
                    "Processing"
                  ) : (
                    <Tooltip title={formatFullDate(created)}>
                      <span>{formatRelative(created)}</span>
                    </Tooltip>
                  )
                }
              />
            </Stack>
          </Grid2>
          <Grid2 xs={12} lg={6}>
            <Stack gap={4}>
              <TagsSection label="Tags" tags={userTags} />
              <TagsSection label="System Tags" tags={systemTags} />
              <ComputeResult messageId={messageId} processId={to} />
              <Stack gap={1} justifyContent="stretch">
                <Typography variant="subtitle2" color="text.secondary">
                  Data
                </Typography>
                <TextField
                  sx={(theme) => ({
                    bgcolor: "var(--mui-palette-background-paper)",
                    "& textarea": {
                      ...theme.typography.body2,
                      fontFamily: MonoFontFF,
                      resize: "both",
                      minWidth: "100%",
                      minHeight: 200,
                    },
                  })}
                  rows={1}
                  multiline
                  variant="outlined"
                  value={data}
                />
              </Stack>
              <Stack gap={1} justifyContent="stretch">
                <Typography variant="subtitle2" color="text.secondary">
                  Result Type
                </Typography>
                <Paper sx={{ width: "100%", padding: 2 }}>
                  <Typography variant="body2" fontFamily={MonoFontFF}>
                    JSON
                  </Typography>
                </Paper>
              </Stack>
            </Stack>
          </Grid2>
        </Grid2>
        <div>
          <Tabs value={activeTab} onChange={handleChange} textColor="primary">
            <TabWithCount value={0} label="Linked messages" chipValue={resultingCount} />
          </Tabs>
          <Box sx={{ marginX: -2 }}>
            <ResultingMessages
              messageId={pushedFor || messageId}
              open={activeTab === 0}
              onCountReady={setResultingCount}
              onDataReady={setResultingMessages}
            />
          </Box>
        </div>
      </Stack>
    </React.Fragment>
  )
}
