"use client"

import { Box, Skeleton, Stack } from "@mui/material"

import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useEffect, useMemo, useState } from "react"

import { AllMessagesTable } from "./AllMessagesTable"
import { AreaChart } from "@/components/Charts/AreaChart"

import { Subheading } from "@/components/Subheading"

import { getNetworkStats } from "@/services/messages-api"
import { HighchartAreaData, NetworkStat } from "@/types"
import { formatAbsString } from "@/utils/date-utils"
import { wait } from "@/utils/utils"

export default function HomePage() {
  const [stats, setStats] = useState<NetworkStat[]>()

  useEffect(() => {
    // Allow the request for messages to go before network stats, as they are more important
    wait(1000)
      .then(() => getNetworkStats())
      .then(setStats)
  }, [])

  const messages = useMemo<HighchartAreaData[]>(
    () =>
      !stats
        ? []
        : stats.slice(-30).map((stat) => [formatAbsString(stat.created_date), stat.tx_count]),
    [stats],
  )

  const totalMessages = useMemo(
    () => (stats?.length ? stats[stats.length - 1].tx_count_rolling : 0),
    [stats],
  )

  const modules = useMemo<HighchartAreaData[]>(
    () =>
      !stats
        ? []
        : stats
            .slice(-30)
            .map((stat) => [formatAbsString(stat.created_date), stat.modules_rolling]),
    [stats],
  )

  const users = useMemo<HighchartAreaData[]>(
    () =>
      !stats
        ? []
        : stats.slice(-30).map((stat) => [formatAbsString(stat.created_date), stat.active_users]),
    [stats],
  )

  const processes = useMemo<HighchartAreaData[]>(
    () =>
      !stats
        ? []
        : stats
            .slice(-30)
            .map((stat) => [formatAbsString(stat.created_date), stat.active_processes]),
    [stats],
  )

  return (
    <Stack component="main" gap={2}>
      {!stats ? (
        <Grid2 container spacing={{ xs: 1, lg: 2 }} marginX={-2.5}>
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
        <Grid2 container spacing={{ xs: 1, lg: 2 }} marginX={-2.5}>
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
