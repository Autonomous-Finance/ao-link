"use client"

import { Box, Stack } from "@mui/material"
import React, { useState } from "react"
import PageWrapper from "@/components/PageWrapper"

import { AllModules } from "./AllModules"
import { Subheading } from "@/components/Subheading"

import { formatNumber } from "@/utils/number-utils"

export default function ModulesPage() {
  const [totalCount, setTotalCount] = useState<number>()

  return (
    <PageWrapper>
      <Stack component="main" gap={2} paddingY={4}>
        <Subheading type="Modules" value={totalCount && formatNumber(totalCount)} />
        <Box sx={{ marginX: -2 }}>
          <AllModules open onCountReady={setTotalCount} />
        </Box>
      </Stack>
    </PageWrapper>
  )
}
