"use client"
import { Box, CircularProgress, Paper, Stack, Tabs, Tooltip, Typography } from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useMemo, useState } from "react"

import { BalanceSection } from "@/components/BalanceSection"
import { ChartDataItem, Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"
import { TabWithCount } from "@/components/TabWithCount"
import { TagsSection } from "@/components/TagsSection"

import { AoMessage } from "@/types"
import { truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { IncomingMessagesTable } from "./IncomingMessagesTable"
import { OutgoingMessagesTable } from "./OutgoingMessagesTable"
import { ProcessInteraction } from "./ProcessInteraction"
import { FetchInfoHandler } from "./ProcessPage/FetchInfoHandler"
import { SpawnedProcesses } from "./SpawnedProcesses"
import { TokenBalances } from "./TokenBalances"
import { TokenTransfers } from "./TokenTransfers"

type ProcessPageProps = {
  message: AoMessage
}

export function ProcessPage(props: ProcessPageProps) {
  const { message } = props

  const {
    id: entityId,
    from: owner,
    type,
    //
    created,
    tags,
    userTags,
    systemTags,
  } = message

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [outgoingCount, setOutgoingCount] = useState<number>()
  const [incomingCount, setIncomingCount] = useState<number>()
  const [processesCount, setProcessesCount] = useState<number>()
  const [transfersCount, setTransfersCount] = useState<number>()
  const [balancesCount, setBalancesCount] = useState<number>()

  const [outgoingMessages, setOutgoingMessages] = useState<AoMessage[] | null>(null)
  const graphData = useMemo<ChartDataItem[] | null>(() => {
    if (outgoingMessages === null) return null

    const results: ChartDataItem[] = outgoingMessages.map((x) => {
      const source_type = x.tags["From-Process"] === x.from ? "Process" : "User"
      const target_type = x.tags["From-Process"] === x.to ? "Process" : "User"

      return {
        id: x.id,
        highlight: true,
        source: `${source_type} ${truncateId(x.from)}`,
        source_id: x.from,
        target: `${target_type} ${truncateId(x.to)}`,
        target_id: x.to,
        type: "Cranked Message",
        action: x.tags["Action"] || "No Action Tag",
      }
    })

    // return unique results only
    const targetIdMap: Record<string, boolean> = {}

    return results.filter((x) => {
      if (targetIdMap[x.target_id]) return false
      targetIdMap[x.target_id] = true
      return true
    })
  }, [outgoingMessages])

  return (
    <Stack component="main" gap={6} paddingY={4}>
      <Subheading type="PROCESS" value={<IdBlock label={entityId} />} />
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
            <SectionInfo
              title="Owner"
              value={<IdBlock label={truncateId(owner)} value={owner} href={`/entity/${owner}`} />}
            />
            <SectionInfo
              title="Module"
              value={
                <IdBlock
                  label={truncateId(tags.Module)}
                  value={tags.Module}
                  href={`/module/${tags.Module}`}
                />
              }
            />
            {tags.Name && <SectionInfo title="Name" value={<IdBlock label={tags.Name} />} />}
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
            <FetchInfoHandler processId={entityId} />
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
            <BalanceSection entityId={entityId} />
          </Stack>
        </Grid2>
      </Grid2>
      <div>
        <Tabs value={activeTab} onChange={handleChange} textColor="primary">
          <TabWithCount value={0} label="Outgoing messages" chipValue={outgoingCount} />
          <TabWithCount value={1} label="Incoming messages" chipValue={incomingCount} />
          <TabWithCount value={2} label="Spawned processes" chipValue={processesCount} />
          <TabWithCount value={3} label="Token transfers" chipValue={transfersCount} />
          <TabWithCount value={4} label="Token balances" chipValue={balancesCount} />
          <TabWithCount value={5} label="Read" sx={{ marginLeft: "auto" }} />
          <TabWithCount value={6} label="Write" />
        </Tabs>
        <Box sx={{ marginX: -2 }}>
          <OutgoingMessagesTable
            entityId={entityId}
            open={activeTab === 0}
            onCountReady={setOutgoingCount}
            onDataReady={setOutgoingMessages}
            isProcess
          />
          <IncomingMessagesTable
            entityId={entityId}
            open={activeTab === 1}
            onCountReady={setIncomingCount}
          />
          <SpawnedProcesses
            entityId={entityId}
            open={activeTab === 2}
            onCountReady={setProcessesCount}
            isProcess
          />
          <TokenTransfers
            entityId={entityId}
            open={activeTab === 3}
            onCountReady={setTransfersCount}
          />
          <TokenBalances
            entityId={entityId}
            open={activeTab === 4}
            onCountReady={setBalancesCount}
          />
          {activeTab === 5 && <ProcessInteraction processId={entityId} readOnly />}
          {activeTab === 6 && <ProcessInteraction processId={entityId} />}
        </Box>
      </div>
    </Stack>
  )
}
