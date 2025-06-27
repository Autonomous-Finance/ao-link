import { Box, CircularProgress, Paper, Stack, Tabs, Tooltip, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { IncomingMessagesTable } from "./IncomingMessagesTable"
import { OutgoingMessagesTable } from "./OutgoingMessagesTable"
import { ProcessInteraction } from "./ProcessInteraction"
import { FetchInfoHandler } from "./ProcessPage/FetchInfoHandler"
import { SourceCode } from "./SourceCode"
import { SpawnedProcesses } from "./SpawnedProcesses"
import { TokenBalances } from "./TokenBalances"
import { TokenTransfers } from "./TokenTransfers"
import { BalanceSection } from "@/components/BalanceSection"
import { EntityBlock } from "@/components/EntityBlock"
import { ChartDataItem, Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"
import { OwnerBlock } from "@/components/OwnerBlock"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"
import { TabWithCount } from "@/components/TabWithCount"
import { TagsSection } from "@/components/TagsSection"

import { getMessageById } from "@/services/messages-api"
import { AoMessage, AoProcess } from "@/types"
import { truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"

type ProcessPageProps = {
  message: AoProcess
}

const defaultTab = "outgoing"

export function ProcessPage(props: ProcessPageProps) {
  const { message } = props

  const {
    id: entityId,
    from: owner,
    type,
    //
    ingestedAt,
    tags,
    userTags,
    systemTags,
  } = message

  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || defaultTab)
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
    if (newValue === defaultTab) {
      setSearchParams({})
    } else {
      setSearchParams({ tab: newValue })
    }
  }

  const [outgoingCount, setOutgoingCount] = useState<number>()
  const [incomingCount, setIncomingCount] = useState<number>()
  const [processesCount, setProcessesCount] = useState<number>()
  const [transfersCount, setTransfersCount] = useState<number>()
  const [balancesCount, setBalancesCount] = useState<number>()
  const [evalCount, setEvalCount] = useState<number>()

  const [outgoingMessages, setOutgoingMessages] = useState<AoMessage[] | null>(null)

  const [entities, setEntities] = useState<Record<string, AoMessage | undefined> | null>(null)
  useEffect(() => {
    if (!outgoingMessages) return
    const entityIdsSet = new Set<string>()

    outgoingMessages?.forEach((x) => {
      entityIdsSet.add(x.from)
      entityIdsSet.add(x.to)
    })

    const entityIds = Array.from(entityIdsSet)

    Promise.all(entityIds.map(getMessageById)).then((entitiesArray) => {
      const newEntities = Object.fromEntries(
        entitiesArray.filter((x): x is AoMessage => x !== undefined).map((x) => [x.id, x]),
      )

      setEntities((prev) => ({ ...prev, ...newEntities }))
    })
  }, [outgoingMessages])

  const graphData = useMemo<ChartDataItem[] | null>(() => {
    if (outgoingMessages === null || !entities) return null

    const results: ChartDataItem[] = outgoingMessages.map((x) => {
      const source_type = entities[x.from]?.type || "User"
      const target_type = entities[x.to]?.type || "User"

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
  }, [outgoingMessages, entities])

  return (
    <Stack component="main" gap={{ xs: 3, sm: 6 }} paddingY={{ xs: 2, sm: 4 }}>
      <Subheading type="PROCESS" value={<IdBlock label={entityId} />} />
      <Grid2 container spacing={{ xs: 2, lg: 12 }}>
        <Grid2 xs={12} lg={6}>
          <Stack gap={{ xs: 2, sm: 4 }}>
            <Paper sx={{
              height: { xs: 300, sm: 400, md: 428 },
              width: '100%', // Make width responsive
              maxWidth: { md: 428 }, // Optional: constrain max width on larger screens if desired
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
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
            <SectionInfo title="Owner" value={<OwnerBlock ownerId={owner} />} />
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
            <BalanceSection entityId={entityId} />
            {/* <ArnsSection entityId={entityId} /> */}
          </Stack>
        </Grid2>
        <Grid2 xs={12} lg={6}>
          <Stack gap={4}>
            <TagsSection label="Tags" tags={userTags} />
            <TagsSection label="System Tags" tags={systemTags} />
            <FetchInfoHandler processId={entityId} />
          </Stack>
        </Grid2>
      </Grid2>
      <Stack>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <TabWithCount value="outgoing" label="Outgoing messages" chipValue={outgoingCount} />
          <TabWithCount value="incoming" label="Incoming messages" chipValue={incomingCount} />
          <TabWithCount value="spawned" label="Spawned processes" chipValue={processesCount} />
          <TabWithCount value="transfers" label="Token transfers" chipValue={transfersCount} />
          <TabWithCount value="balances" label="Token balances" chipValue={balancesCount} />
          <TabWithCount value="read" label="Read" sx={{ marginLeft: "auto" }} />
          <TabWithCount value="write" label="Write" />
          <TabWithCount value="source-code" label="Source Code" chipValue={evalCount} />
        </Tabs>
        <Box sx={{ marginX: { xs: 0, sm: -2 } }}> {/* Adjust negative margin for mobile */}
          <OutgoingMessagesTable
            entityId={entityId}
            open={activeTab === "outgoing"}
            onCountReady={setOutgoingCount}
            onDataReady={setOutgoingMessages}
            isProcess
          />
          <IncomingMessagesTable
            entityId={entityId}
            open={activeTab === "incoming"}
            onCountReady={setIncomingCount}
          />
          <SpawnedProcesses
            entityId={entityId}
            open={activeTab === "spawned"}
            onCountReady={setProcessesCount}
            isProcess
          />
          <TokenTransfers
            entityId={entityId}
            open={activeTab === "transfers"}
            onCountReady={setTransfersCount}
          />
          <TokenBalances
            entityId={entityId}
            open={activeTab === "balances"}
            onCountReady={setBalancesCount}
          />
          {activeTab === "read" && <ProcessInteraction processId={entityId} readOnly />}
          {activeTab === "write" && <ProcessInteraction processId={entityId} />}
          <SourceCode
            entityId={entityId}
            open={activeTab === "source-code"}
            onCountReady={setEvalCount}
          />
        </Box>
      </Stack>
    </Stack>
  )
}
