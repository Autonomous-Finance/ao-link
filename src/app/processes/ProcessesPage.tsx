"use client"

import { Box, Stack } from "@mui/material"

import { useState } from "react"

import { AllProcesses } from "./AllProcesses"
import { Subheading } from "@/components/Subheading"

import { formatNumber } from "@/utils/number-utils"

export default function ProcessesPage() {
  const [totalCount, setTotalCount] = useState<number>()

  return (
    <Stack component="main" gap={2} paddingY={4}>
      <Subheading type="Processes" value={totalCount && formatNumber(totalCount)} />
      <Box sx={{ marginX: -2 }}>
        <AllProcesses open onCountReady={setTotalCount} />
      </Box>
    </Stack>
  )
}