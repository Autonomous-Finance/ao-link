import { Stack, Typography, Box } from "@mui/material"
import React, { ReactNode } from "react"

import { MonoFontFF } from "./RootLayout/fonts"
import { IdBlock } from "./IdBlock"
import { CopyToClipboard } from "./CopyToClipboard"

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
            userSelect: 'text',
            gap: 1,
            lineHeight: 1.2,
          }}
        >
          {typeof value === 'string' ? (
            <>
              <span style={{ userSelect: 'text', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80vw', display: 'inline-block' }}>{value}</span>
              <CopyToClipboard value={value} />
            </>
          ) : (
            value
          )}
        </Box>
      </Stack>
    </Typography>
  )
}
