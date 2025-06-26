"use client"

import { Box, Stack } from "@mui/material"
import React, { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { AllProcesses } from "./AllProcesses"
import { Subheading } from "@/components/Subheading"
import PageSkeleton from "@/components/PageSkeleton"
import ErrorView from "@/components/ErrorView"

import { formatNumber } from "@/utils/number-utils"

export default function ProcessesPage() {
  const [totalCount, setTotalCount] = useState<number>()

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ErrorBoundary fallback={<ErrorView />}>
        <Stack component="main" gap={2} paddingY={4}>
          <Subheading type="Processes" value={totalCount && formatNumber(totalCount)} />
          <Box sx={{ marginX: -2 }}>
            <AllProcesses open onCountReady={setTotalCount} />
          </Box>
        </Stack>
      </ErrorBoundary>
    </Suspense>
  )
}
