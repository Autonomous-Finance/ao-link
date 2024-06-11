"use client"

import { Box, Skeleton, Stack } from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useEffect, useState } from "react"

import { AreaChart } from "@/components/Charts/AreaChart"

import { Subheading } from "@/components/Subheading"
import {
  getMessageStats,
  getModuleStats,
  getProcessStats,
  getTotalMessages,
  getUserStats,
} from "@/services/aometrics"

import { HighchartAreaDataServer } from "@/types"

import { AllMessagesTable } from "./AllMessagesTable"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const [stats, setStats] = useState<
    [
      HighchartAreaDataServer[],
      number,
      HighchartAreaDataServer[],
      HighchartAreaDataServer[],
      HighchartAreaDataServer[],
    ]
  >([[], 0, [], [], [], []] as any)

  useEffect(() => {
    Promise.all([
      getMessageStats(),
      getTotalMessages(),
      getModuleStats(),
      getUserStats(),
      getProcessStats(),
    ]).then(setStats)
  }, [])

  const [messages, totalMessages, modules, users, processes] = stats

  return (
    <Stack component="main" gap={2}>
      {messages.length === 0 ? (
        <Grid2 container spacing={{ xs: 1, lg: 2 }}>
          <Grid2 xs={6} lg={3}>
            <Skeleton height={150} variant="rectangular" />
          </Grid2>
          <Grid2 xs={6} lg={3}>
            <Skeleton height={150} variant="rectangular" />
          </Grid2>
          <Grid2 xs={6} lg={3}>
            <Skeleton height={150} variant="rectangular" />
          </Grid2>
          <Grid2 xs={6} lg={3}>
            <Skeleton height={150} variant="rectangular" />
          </Grid2>
        </Grid2>
      ) : (
        <Grid2 container spacing={{ xs: 1, lg: 2 }}>
          <Grid2 xs={6} lg={3}>
            <AreaChart data={messages} titleText="TOTAL MESSAGES" overrideValue={totalMessages} />
          </Grid2>
          <Grid2 xs={6} lg={3}>
            <AreaChart data={users} titleText="USERS" />
          </Grid2>
          <Grid2 xs={6} lg={3}>
            <AreaChart data={processes} titleText="PROCESSES" />
          </Grid2>
          <Grid2 xs={6} lg={3}>
            <AreaChart data={modules} titleText="MODULES" />
          </Grid2>
        </Grid2>
      )}
      <Subheading type="Latest messages" />
      <Box sx={{ marginX: -2 }}>
        <AllMessagesTable open />
      </Box>
    </Stack>
  )
}
