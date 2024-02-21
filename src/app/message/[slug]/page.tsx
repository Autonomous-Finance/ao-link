import { Grid, Paper, Stack, Typography } from "@mui/material"

import { Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"

import { MonoFontFF } from "@/components/RootLayout/fonts"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { getAoEventById } from "@/services/aoscan"
import { normalizeAoEvent, normalizeTags } from "@/utils/ao-event-utils"
import { truncateId } from "@/utils/data-utils"
import { formatRelative } from "@/utils/date-utils"
import { getColorFromText } from "@/utils/tailwind-utils"

import { ComputeResult } from "./ComputeResult"

type MessagePageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function MessagePage(props: MessagePageProps) {
  const { slug: messageId } = props.params

  const event = await getAoEventById(messageId)

  if (!event) {
    return <div>Not Found</div>
  }

  const normalizedEvent = normalizeAoEvent(event)

  const { id, owner, type, blockHeight, created, processId } = normalizedEvent
  const tags = normalizeTags(event.tags_flat)

  let data = ""
  try {
    const dataResponse = await fetch(`https://arweave.net/${messageId}`)
    data = await dataResponse.text()
  } catch (error) {
    console.log("📜 LOG > MessagePage > arweave.net error:", error)
  }

  return (
    <main className="min-h-screen mb-6">
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">MESSAGE</p>
        <p className="font-bold">/</p>
        <IdBlock label={id} />
      </div>
      <Grid container spacing={{ xs: 2, lg: 12 }}>
        <Grid item xs={12} lg={6}>
          <Stack gap={4}>
            <Paper sx={{ height: 428, width: 428 }}>
              <Graph messageId={id} />
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
              title="Process ID"
              value={
                <IdBlock
                  label={truncateId(processId)}
                  value={processId}
                  href={`/process/${processId}`}
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
            <ComputeResult messageId={messageId} processId={processId} />
            <Stack gap={1} justifyContent="stretch">
              <Typography variant="subtitle2" color="text.secondary">
                Data
              </Typography>
              <Paper sx={{ width: "100%", padding: 2 }}>
                <Typography variant="body2" fontFamily={MonoFontFF}>
                  {data}
                </Typography>
              </Paper>
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
    </main>
  )
}
