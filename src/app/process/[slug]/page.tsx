import { Grid, Paper, Stack, Typography } from "@mui/material"

import { Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import MessagesTable from "@/page-components/ProcessPage/MessagesTable"
import { getAoEventById, getLatestMessagesForProcess } from "@/services/aoscan"
import { normalizeAoEvent, normalizeTags } from "@/utils/ao-event-utils"
import { truncateId } from "@/utils/data-utils"
import { formatRelative } from "@/utils/date-utils"
import { getColorFromText } from "@/utils/tailwind-utils"

type ProcessPageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function ProcessPage(props: ProcessPageProps) {
  const { slug: processId } = props.params

  const event = await getAoEventById(processId)

  if (!event) {
    return <div>Not Found</div>
  }

  const normalizedEvent = normalizeAoEvent(event)

  const { id, owner, type, blockHeight, created } = normalizedEvent
  const tags = normalizeTags(event.tags_flat)

  const events = (await getLatestMessagesForProcess(processId)) || []
  const initialTableData = events.map(normalizeAoEvent)

  return (
    <main className="min-h-screen mb-6">
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">PROCESS</p>
        <p className="font-bold">/</p>
        <IdBlock label={id} />
      </div>
      <Grid container spacing={{ xs: 2, lg: 12 }}>
        <Grid item xs={12} lg={6}>
          <Stack gap={4}>
            <Paper sx={{ height: 428, width: 428 }}>
              <Graph messageId={id} isProcess />
            </Paper>
            <SectionInfoWithChip title="Type" value={type} />
            <SectionInfo
              title="Owner"
              value={
                <IdBlock
                  label={truncateId(owner)}
                  value={owner}
                  href={`/owner/${owner}`}
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
                    sx={{ padding: 0.5 }}
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
      <div className="text-main-dark-color uppercase mt-[2.75rem] mb-8">
        Latest messages
      </div>
      <MessagesTable initialData={initialTableData} processId={processId} />
    </main>
  )
}
