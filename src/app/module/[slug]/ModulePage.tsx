"use client"
import { Box, Stack, Tabs, Tooltip, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useQuery } from "@tanstack/react-query"
import React, { useMemo, useState } from "react"

import { useParams } from "react-router-dom"

import { ProcessesByModule } from "@/app/entity/[slug]/ProcessesByModule"
import { ArNSNameDisplay } from "@/components/ArNSNameChip"
import { IdBlock } from "@/components/IdBlock"
import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"
import { useArnsNameForAddress } from "@/hooks/useArnsNameForAddress"

import { TabWithCount } from "@/components/TabWithCount"
import { getMessageById } from "@/services/messages-api"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"
import { isArweaveId } from "@/utils/utils"

export function ModulePage() {
  const { moduleId = "" } = useParams()

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [processesCount, setProcessesCount] = useState<number>()

  const isValidId = useMemo(() => isArweaveId(String(moduleId)), [moduleId])
  const { data: moduleArnsName } = useArnsNameForAddress(moduleId)

  const {
    data: message,
    isLoading,
    error,
  } = useQuery({
    enabled: Boolean(moduleId) && isValidId,
    queryKey: ["message", moduleId],
    queryFn: () => getMessageById(moduleId),
  })

  if (isLoading) {
    return <LoadingSkeletons />
  }

  if (!isValidId || error || !message) {
    return (
      <Stack component="main" gap={4} paddingY={4}>
        <Typography>{error?.message || "Module not found."}</Typography>
      </Stack>
    )
  }

  return (
    <Stack component="main" gap={6} paddingY={4} key={moduleId}>
      <Subheading 
        type="MODULE" 
        value={
          <Stack direction="row" gap={1} alignItems="center">
            <IdBlock label={moduleId} />
            {moduleArnsName && (
              <ArNSNameDisplay
                name={moduleArnsName}
                onClick={() => window.open(`https://${moduleArnsName}.ar.io`, '_blank')}
              />
            )}
          </Stack>
        } 
      />
      <Grid2 container spacing={{ xs: 2, lg: 12 }}>
        <Grid2 xs={12} lg={6}>
          <Stack gap={4}>
            <SectionInfoWithChip title="Type" value={"Module"} />
            <SectionInfo
              title="Seen at"
              value={
                message.ingestedAt === null ? (
                  "Processing"
                ) : (
                  <Tooltip title={formatFullDate(message.ingestedAt)}>
                    <span>{formatRelative(message.ingestedAt)}</span>
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
