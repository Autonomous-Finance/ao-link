"use client"
import { Box, Stack, Tabs, Tooltip } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import React, { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import { ProcessesByModule } from "@/app/entity/[slug]/ProcessesByModule"
import { IdBlock } from "@/components/IdBlock"
import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"

import { TabWithCount } from "@/components/TabWithCount"
import { getMessageById } from "@/services/messages-api"
import { AoMessage } from "@/types"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

export function ModulePage() {
  const { moduleId } = useParams()

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [processesCount, setProcessesCount] = useState<number>()
  const [message, setMessage] = useState<AoMessage | undefined | null>(null)

  useEffect(() => {
    if (!moduleId) return

    getMessageById(moduleId).then(setMessage)
  }, [moduleId])

  if (message === null) return <LoadingSkeletons />

  if (!moduleId || !message) {
    return <div>Not Found</div>
  }

  return (
    <Stack component="main" gap={6} paddingY={4} key={moduleId}>
      <Subheading type="MODULE" value={<IdBlock label={moduleId} />} />
      <Grid2 container spacing={{ xs: 2, lg: 12 }}>
        <Grid2 xs={12} lg={6}>
          <Stack gap={4}>
            <SectionInfoWithChip title="Type" value={"Module"} />
            <SectionInfo
              title="Created"
              value={
                message.created === null ? (
                  "Processing"
                ) : (
                  <Tooltip title={formatFullDate(message.created)}>
                    <span>{formatRelative(message.created)}</span>
                  </Tooltip>
                )
              }
            />
            {/* <SectionInfo title="Incoming messages" value={formatNumber(message.incoming_messages)} /> */}
            {/* <SectionInfo title="Processes" value={formatNumber(message.processes)} /> */}
          </Stack>
        </Grid2>
        <Grid2 xs={12} lg={6}>
          <Stack gap={4}>
            <SectionInfo title="Memory limit" value={message.tags["Memory-Limit"]} />
            <SectionInfo
              title="Compute limit"
              value={formatNumber(parseInt(message.tags["Compute-Limit"]))}
            />
            <SectionInfo title="Data protocol" value={message.tags["Data-Protocol"]} />
            <SectionInfo title="Input encoding" value={message.tags["Input-Encoding"]} />
            <SectionInfo title="Output encoding" value={message.tags["Output-Encoding"]} />
            <SectionInfo title="Content Type" value={message.tags["Content-Type"]} />
            <SectionInfo title="Module format" value={message.tags["Module-Format"]} />
            <SectionInfo title="Variant" value={message.tags["Variant"]} />
          </Stack>
        </Grid2>
      </Grid2>
      <div>
        <Tabs value={activeTab} onChange={handleChange} textColor="primary">
          <TabWithCount value={0} label="Processes" chipValue={processesCount} />
        </Tabs>
        <Box sx={{ marginX: -2 }}>
          <ProcessesByModule
            moduleId={moduleId}
            open={activeTab === 0}
            onCountReady={setProcessesCount}
          />
        </Box>
      </div>
    </Stack>
  )
}
