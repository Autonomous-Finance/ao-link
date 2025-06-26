"use client"

import { Box, Stack } from "@mui/material"
import React, { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { AllBlocks } from "./AllBlocks"
import { Subheading } from "@/components/Subheading"
import PageSkeleton from "@/components/PageSkeleton"
import ErrorView from "@/components/ErrorView"

export default function BlocksPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ErrorBoundary fallback={<ErrorView />}>
        <Stack component="main" gap={2} paddingY={4}>
          <Subheading type="Blocks" />
          <Box sx={{ marginX: -2 }}>
            <AllBlocks open />
          </Box>
        </Stack>
      </ErrorBoundary>
    </Suspense>
  )
}
