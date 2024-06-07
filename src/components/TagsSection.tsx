import { Stack, Typography } from "@mui/material"
import React from "react"

import { TagChip } from "./TagChip"

export function TagsSection({ tags, label }: { tags: Record<string, string>; label: string }) {
  const entries = Object.entries(tags).sort((a, b) => a[0].localeCompare(b[0]))

  if (entries.length === 0) return null

  return (
    <Stack gap={1} justifyContent="stretch">
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ maxHeight: 178, overflowY: "auto" }}>
        {entries.map(([name, value]) => (
          <TagChip key={name} name={name} value={value} />
        ))}
      </Stack>
    </Stack>
  )
}
