import { Box, CircularProgress, Paper, Stack, Tabs, Tooltip, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import React, { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { HyperbeamPanel } from "./HyperbeamPanel"
import { IncomingMessagesTable } from "./IncomingMessagesTable"
import { OutgoingMessagesTable } from "./OutgoingMessagesTable"
import { ProcessInteraction } from "./ProcessInteraction"
import { FetchInfoHandler } from "./ProcessPage/FetchInfoHandler"
import { SourceCode } from "./SourceCode"
import { SpawnedProcesses } from "./SpawnedProcesses"
import { TokenBalances } from "./TokenBalances"
import { TokenTransfers } from "./TokenTransfers"
import { BalanceSection } from "@/components/BalanceSection"
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

type ProcessPageProps = { message: AoProcess }
const defaultTab = "outgoing"

export function ProcessPage({ message }: ProcessPageProps) {
  const { id: entityId, from: owner, type, ingestedAt, tags, userTags, systemTags } = message

  const HB_BASE = `https://hb.zoao.dev/${entityId}~process@1.0`

  // tab state
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || defaultTab)
  const handleChange = (_: any, newValue: string) => {
    setActiveTab(newValue)
    setSearchParams(newValue === defaultTab ? {} : { tab: newValue })
  }

  // counts
  const [outCount, setOutCount] = useState<number>()
  const [inCount, setInCount] = useState<number>()
  const [prCount, setPrCount] = useState<number>()
  const [trCount, setTrCount] = useState<number>()
  const [baCount, setBaCount] = useState<number>()
  const [evCount, setEvCount] = useState<number>()

  // graph data
  const [outMsgs, setOutMsgs] = useState<AoMessage[] | null>(null)
  const [ents, setEnts] = useState<Record<string, AoMessage> | null>(null)
  useEffect(() => {
    if (!outMsgs) return
    const ids = Array.from(new Set(outMsgs.flatMap((m) => [m.from, m.to])))
    Promise.all(ids.map(getMessageById)).then((res) => {
      const map = Object.fromEntries(res.filter((x): x is AoMessage => !!x).map((x) => [x.id, x]))
      setEnts((prev) => ({ ...(prev || {}), ...map }))
    })
  }, [outMsgs])

  const graphData = useMemo<ChartDataItem[] | null>(() => {
    if (!outMsgs || !ents) return null
    const seen: Record<string, boolean> = {}
    return outMsgs
      .map((x) => ({
        id: x.id,
        highlight: true,
        source: `${ents[x.from]?.type || "User"} ${truncateId(x.from)}`,
        source_id: x.from,
        target: `${ents[x.to]?.type || "User"} ${truncateId(x.to)}`,
        target_id: x.to,
        type: "Cranked Message" as const,
        action: x.tags["Action"] || "No Action Tag",
      }))
      .filter((item) => {
        if (seen[item.target_id]) return false
        seen[item.target_id] = true
        return true
      })
  }, [outMsgs, ents])

  // Hyperbeam availability
  const [hbAvail, setHbAvail] = useState(false)
  useEffect(() => {
    fetch(`${HB_BASE}/compute/keys/serialize~json@1.0`, { method: "HEAD" })
      .then(r => setHbAvail(r.ok))
      .catch(() => setHbAvail(false))
  }, [entityId])

  useEffect(() => {
    // If the current tab is "hyperbeam" but it's not available, switch to default
    if (activeTab === "hyperbeam" && !hbAvail) {
      setActiveTab(defaultTab)
      setSearchParams({})
    }
  }, [hbAvail, activeTab, setSearchParams])

  return (
    <Stack component="main" gap={6} paddingY={4}>
      <Subheading type="PROCESS" value={<IdBlock label={entityId} />} />

      <Grid2 container spacing={{ xs: 2, lg: 12 }}>
        <Grid2 xs={12} lg={6}>
          <Stack gap={4}>
            <Paper sx={{ height: 428, width: 428 }}>
              {graphData === null ? (
                <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                  <CircularProgress size={24} />
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
        <Tabs value={activeTab} onChange={handleChange} textColor="primary">
          {hbAvail && <TabWithCount value="hyperbeam" label="Hyperbeam" />}
          <TabWithCount value="outgoing" label="Outgoing messages" chipValue={outCount} />
          <TabWithCount value="incoming" label="Incoming messages" chipValue={inCount} />
          <TabWithCount value="spawned" label="Spawned processes" chipValue={prCount} />
          <TabWithCount value="transfers" label="Token transfers" chipValue={trCount} />
          <TabWithCount value="balances" label="Token balances" chipValue={baCount} />
          <TabWithCount value="read" label="Read" sx={{ marginLeft: "auto" }} />
          <TabWithCount value="write" label="Write" />
          <TabWithCount value="source-code" label="Source Code" chipValue={evCount} />
        </Tabs>

        <Box sx={{ marginX: -2 }}>
          <OutgoingMessagesTable
            entityId={entityId}
            open={activeTab === "outgoing"}
            onCountReady={setOutCount}
            onDataReady={setOutMsgs}
            isProcess
          />
          <IncomingMessagesTable
            entityId={entityId}
            open={activeTab === "incoming"}
            onCountReady={setInCount}
          />
          <SpawnedProcesses
            entityId={entityId}
            open={activeTab === "spawned"}
            onCountReady={setPrCount}
            isProcess
          />
          <TokenTransfers
            entityId={entityId}
            open={activeTab === "transfers"}
            onCountReady={setTrCount}
          />
          <TokenBalances
            entityId={entityId}
            open={activeTab === "balances"}
            onCountReady={setBaCount}
          />
          {activeTab === "read" && <ProcessInteraction processId={entityId} readOnly />}
          {activeTab === "write" && <ProcessInteraction processId={entityId} />}
          <SourceCode
            entityId={entityId}
            open={activeTab === "source-code"}
            onCountReady={setEvCount}
          />

          {/* only mount HyperbeamPanel once you click that tab */}
          {activeTab === "hyperbeam" && <HyperbeamPanel baseUrl={HB_BASE} open />}
        </Box>
      </Stack>
    </Stack>
  )
}
