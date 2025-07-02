import { Skeleton, Stack } from "@mui/material"
import React from "react"

export default function PageSkeleton() {
  return (
    <Stack gap={2} sx={{ p: 4 }}>
      <Skeleton variant="rectangular" height={40} />
      <Skeleton variant="rectangular" height={300} />
      <Skeleton variant="rectangular" height={300} />
    </Stack>
  )
} 