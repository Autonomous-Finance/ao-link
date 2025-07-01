import { Stack, Typography, Box } from "@mui/material"
import React, { ReactNode } from "react"

import { MonoFontFF } from "./RootLayout/fonts"
import { IdBlock } from "./IdBlock"

type SubheadingProps = {
  type: string
  value?: ReactNode
}

export function Subheading(props: SubheadingProps) {
  const { type, value } = props

  if (value === undefined) {
    return (
      <Typography
        variant="body2"
        component="div"
        color="text.secondary"
        fontWeight={700}
        sx={{ textTransform: "uppercase" }}
      >
        {type}
      </Typography>
    )
  }

  return (
    <Typography variant="body2" component="div">
      <Stack direction="row" gap={1} alignItems="center">
        <Typography
          variant="inherit"
          color="text.secondary"
          sx={{ textTransform: "uppercase" }}
          fontWeight={700}
        >
          {type}
        </Typography>
        <Typography variant="inherit" fontWeight={700}>
          /
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            maxWidth: '100vw',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            fontFamily: MonoFontFF,
            fontSize: '0.95em',
          }}
        >
          {/* If value is a string, show full and copyable; else fallback to original */}
          {typeof value === 'string' ? (
            <IdBlock label={value} value={value} hideTooltip />
          ) : (
            value
          )}
        </Box>
      </Stack>
    </Typography>
  )
}
