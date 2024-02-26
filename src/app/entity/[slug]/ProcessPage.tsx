"use client"
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material"

import { useCallback, useEffect, useState } from "react"

import { ChartDataItem, Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { supabase } from "@/lib/supabase"
import MessagesTable from "@/page-components/ProcessPage/MessagesTable"
import { AoEvent } from "@/services/aoscan"
import {
  NormalizedAoEvent,
  normalizeAoEvent,
  normalizeTags,
} from "@/utils/ao-event-utils"
import { truncateId } from "@/utils/data-utils"
import { formatRelative } from "@/utils/date-utils"
import { getColorFromText } from "@/utils/tailwind-utils"

type ProcessPageProps = {
  event: AoEvent
  // messages: AoEvent[]
}

export function ProcessPage(props: ProcessPageProps) {
  const { event } = props

  const normalizedEvent = normalizeAoEvent(event)

  const {
    id: processId,
    from: owner,
    type,
    blockHeight,
    created,
  } = normalizedEvent
  const { tags } = normalizeTags(event.tags_flat)

  const [loading, setLoading] = useState(true)
  const [graphData, setChartData] = useState<ChartDataItem[]>([])
  const [linkedMessages, setLinkedMessages] = useState<NormalizedAoEvent[]>([])

  useEffect(() => {
    setLoading(true)
    supabase
      .rpc("get_message_network_v2", {
        p_id: processId,
        is_process: true,
      })
      .returns<{ graph: ChartDataItem[]; messages: AoEvent[] }>()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error("Error calling Supabase RPC:", error.message)
          return
        }

        const { graph, messages } = data

        setChartData(graph)
        setLinkedMessages(
          messages
            .map(normalizeAoEvent)
            .sort((a, b) => b.created.getTime() - a.created.getTime()),
        )
        setLoading(false)
      })
  }, [processId])

  const [tableFilter, setTableFilter] = useState<{
    from: string
    to: string
  } | null>(null)

  const handleLinkClick = useCallback((from: string, to: string) => {
    console.log("📜 LOG > handleLinkClick > { from, to }:", { from, to })
    setTableFilter({ from, to })
  }, [])

  return (
    <main className="min-h-screen mb-6">
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">PROCESS</p>
        <p className="font-bold">/</p>
        <IdBlock label={processId} />
      </div>
      <Grid container spacing={{ xs: 2, lg: 12 }}>
        <Grid item xs={12} lg={6}>
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
              title="Block Height"
              value={
                <IdBlock
                  label={String(blockHeight)}
                  href={`/block/${blockHeight}`}
                />
              }
            />
            <SectionInfo title="Created" value={formatRelative(created)} />
          </Stack>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Stack gap={4}>
            <Stack gap={1} justifyContent="stretch">
              <Typography variant="subtitle2" color="text.secondary">
                Tags
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
                sx={{
                  maxHeight: 178,
                  overflowY: "auto",
                }}
              >
                {Object.entries(tags).map(([key, value]) => (
                  <Typography
                    key={key}
                    className={getColorFromText(key)}
                    sx={{ padding: 0.5, color: "black" }}
                    variant="caption"
                    fontFamily={MonoFontFF}
                  >
                    {key}:{value}
                  </Typography>
                ))}
              </Stack>
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
        </Grid>
      </Grid>
      {linkedMessages.length > 0 && (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              sx={{ textTransform: "uppercase", marginBottom: 3, marginTop: 6 }}
            >
              Linked messages
            </Typography>
            {tableFilter && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setTableFilter(null)}
              >
                Clear filter
              </Button>
            )}
          </Stack>
          <MessagesTable data={linkedMessages} tableFilter={tableFilter} />
        </>
      )}
    </main>
  )
}
