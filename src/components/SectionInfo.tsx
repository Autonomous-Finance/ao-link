import { Stack, Typography } from "@mui/material"
import React from "react"

import { MonoFontFF } from "./RootLayout/fonts"

export const SectionInfo = ({
  title,
  value,
}: {
  title: string
  value: React.ReactNode
}) => (
  <Stack gap={1} direction="row">
    <Typography variant="subtitle2" color="text.secondary" width={220}>
      {title}
    </Typography>
    <Typography variant="body2" fontFamily={MonoFontFF} component="div">
      {value}
    </Typography>
  </Stack>
)
