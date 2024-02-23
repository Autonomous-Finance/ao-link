import { Stack, Typography } from "@mui/material"
import React from "react"

import { TypeBadge } from "./TypeBadge"

export const SectionInfoWithChip = ({
  title,
  value,
}: {
  title: string
  value: string
}) => (
  <Stack gap={1} direction="row">
    <Typography variant="subtitle2" color="text.secondary" width={220}>
      {title}
    </Typography>
    <TypeBadge type={value} />
  </Stack>
)
