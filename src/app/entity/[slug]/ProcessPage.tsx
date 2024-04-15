"use client"
import {
  CircularProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useCallback, useEffect, useState } from "react"

import { BalanceSection } from "@/components/BalanceSection"
import { ChartDataItem, Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"
import { TagsSection } from "@/components/TagsSection"
import { supabase } from "@/lib/supabase"

import { AoEvent, Process } from "@/services/aoscan"
import { normalizeAoEvent, normalizeTags } from "@/utils/ao-event-utils"
import { truncateId } from "@/utils/data-utils"
import { formatRelative } from "@/utils/date-utils"

import { EntityMessages } from "./EntityMessages"
import { FetchInfoHandler } from "./ProcessPage/FetchInfoHandler"
import { TokenBalances } from "./TokenBalances"
import { TokenTransfers } from "./TokenTransfers"

type ProcessPageProps = {
  event: AoEvent
  process: Process
}

export function ProcessPage(props: ProcessPageProps) {
  const { event, process } = props

  const normalizedEvent = normalizeAoEvent(event)

  const {
    id: entityId,
    from: owner,
    type,
    blockHeight,
    created,
  } = normalizedEvent
  const { tags } = normalizeTags(event.tags_flat)

  const [loading, setLoading] = useState(true)
  const [graphData, setChartData] = useState<ChartDataItem[]>([])

  useEffect(() => {
    setLoading(true)
    supabase
      .rpc("get_message_network_v2", {
        p_id: entityId,
        is_process: true,
        p_include_messages: false,
      })
      .returns<{ graph: ChartDataItem[]; messages: AoEvent[] }>()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error("Error calling Supabase RPC:", error.message)
          return
        }

        const { graph } = data

        setChartData(graph)

        setLoading(false)
      })
  }, [entityId])

  const [tableFilter, setTableFilter] = useState<{
    from: string
    to: string
  } | null>(null)

  const handleLinkClick = useCallback((from: string, to: string) => {
    setTableFilter({ from, to })
  }, [])

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Stack component="main" gap={6} paddingY={4}>
      <Subheading type="PROCESS" value={<IdBlock label={entityId} />} />
      <Grid2 container spacing={{ xs: 2, lg: 12 }}>
        <Grid2 xs={12} lg={6}>
          <Stack gap={4}>
            <Paper sx={{ height: 428, width: 428 }}>
              {loading ? (
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  sx={{ height: "100%" }}
                >
                  <CircularProgress size={24} color="primary" />
                </Stack>
              ) : (
                <Graph data={graphData} onLinkClick={handleLinkClick} />
              )}
            </Paper>
            <SectionInfoWithChip title="Type" value={type} />
            <SectionInfo
              title="Owner"
              value={
                <IdBlock
                  label={truncateId(owner)}
                  value={owner}
                  href={`/entity/${owner}`}
                />
              }
            />
            <SectionInfo
              title="Module"
              value={
                <IdBlock
                  label={truncateId(process.module)}
                  value={process.module}
                  href={`/module/${process.module}`}
                />
              }
            />
            {/* <SectionInfo
              title="Block Height"
              value={
                <IdBlock
                  label={String(blockHeight)}
                  href={`/block/${blockHeight}`}
                />
              }
            /> */}
            <SectionInfo title="Created" value={formatRelative(created)} />
            {/* <SectionInfo
              title="Incoming messages"
              value={formatNumber(process.incoming_messages)}
            /> */}
          </Stack>
        </Grid2>
        <Grid2 xs={12} lg={6}>
          <Stack gap={4}>
            <TagsSection tags={tags} />
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
          <Tab value={0} label="Messages" />
          <Tab value={2} label="Token transfers" />
          <Tab value={3} label="Token balances" />
        </Tabs>
        <Paper sx={{ marginX: -2 }}>
          <EntityMessages entityId={entityId} open={activeTab === 0} />
          {/* {activeTab === 0 && (
            <MessagesTable
              processId={entityId}
              tableFilter={tableFilter}
              setTableFilter={setTableFilter}
            />
          )} */}
          <TokenTransfers entityId={entityId} open={activeTab === 2} />
          <TokenBalances entityId={entityId} open={activeTab === 3} />
        </Paper>
      </div>
    </Stack>
  )
}
