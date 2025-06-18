// src/app/entity/[slug]/HyperbeamPanel.tsx
import { ExpandMore, ChevronRight } from "@mui/icons-material"
import { Box, CircularProgress, Paper, Stack, Typography, IconButton } from "@mui/material"
import React, { useEffect, useState, memo } from "react"

import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"

export type HyperbeamPanelProps = {
  baseUrl: string
  open: boolean
}

const HyperbeamPanel = memo(function HyperbeamPanel({ baseUrl, open }: HyperbeamPanelProps) {
  const [keys, setKeys] = useState<string[] | null>(null)
  const [loadingKeys, setLoadingKeys] = useState(false)
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({})
  const [values, setValues] = useState<Record<string, any>>({})
  const [loadingValue, setLoadingValue] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!open) return
    setLoadingKeys(true)
    fetch(`${baseUrl}/compute/keys/serialize~json@1.0`, { method: "HEAD" })
      .then((r) =>
        r.ok
          ? fetch(`${baseUrl}/compute/keys/serialize~json@1.0`).then((res) => res.json())
          : Promise.reject(),
      )
      .then(data => {
        const list = Array.isArray(data) ? data : Object.values(data)
        setKeys(list as string[])
      })
      .catch(() => setKeys(null))
      .finally(() => setLoadingKeys(false))
  }, [baseUrl, open])

  const toggleKey = (key: string) => {
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }))
    if (!values.hasOwnProperty(key) && !loadingValue[key]) {
      setLoadingValue((prev) => ({ ...prev, [key]: true }))
      fetch(`${baseUrl}/compute/${key}/serialize~json@1.0`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((json) => setValues((prev) => ({ ...prev, [key]: json })))
        .catch(() => setValues((prev) => ({ ...prev, [key]: null })))
        .finally(() => setLoadingValue((prev) => ({ ...prev, [key]: false })))
    }
  }

  if (!open) return null

  return (
    <Paper sx={{ p: 3, maxHeight: 500, overflowY: "auto" }}>
      <Stack gap={2}>
        <Subheading type="HYPERBEAM" value="Hyperbeam Data" />

        {loadingKeys ? (
          <CircularProgress size={24} />
        ) : keys === null ? (
          <SectionInfo title="Availability" value="Not available on Hyperbeam" />
        ) : (
          <>
            <SectionInfoWithChip title="Keys found" value={String(keys.length)} />
            {keys.map((key) => (
              <Box key={key}>
                <Box display="flex" alignItems="center">
                  <IconButton size="small" onClick={() => toggleKey(key)}>
                    {openKeys[key] ? <ExpandMore /> : <ChevronRight />}
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => toggleKey(key)}
                  >
                    {key}
                  </Typography>
                </Box>
                {openKeys[key] && (
                  <Box sx={{ pl: 4, pt: 1 }}>
                    {loadingValue[key] ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Typography component="pre" sx={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
                        {values[key]?.body ?? JSON.stringify(values[key], null, 2) ?? "No data"}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </>
        )}
      </Stack>
    </Paper>
  )
})

export { HyperbeamPanel }