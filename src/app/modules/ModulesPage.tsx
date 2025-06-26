"use client"

import { Box, Stack } from "@mui/material"
import React, { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { AllModules } from "./AllModules"
import { Subheading } from "@/components/Subheading"
import PageSkeleton from "@/components/PageSkeleton"
import ErrorView from "@/components/ErrorView"

import { formatNumber } from "@/utils/number-utils"

export default function ModulesPage() {
  const [totalCount, setTotalCount] = useState<number>()

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ErrorBoundary fallback={<ErrorView />}>
        <Stack component="main" gap={2} paddingY={4}>
          <Subheading type="Modules" value={totalCount && formatNumber(totalCount)} />
          <Box sx={{ marginX: -2 }}>
            <AllModules open onCountReady={setTotalCount} />
          </Box>
        </Stack>
      </ErrorBoundary>
    </Suspense>
  )
}
