"use client"

import { Box, Tooltip } from "@mui/material"
import { Check, Copy } from "@phosphor-icons/react"
import React from "react"

type CopyToClipboardProps = {
  value: string
}

export function CopyToClipboard(props: CopyToClipboardProps) {
  const { value } = props

  const [copied, setCopied] = React.useState(false)

  if (!value) return null

  return (
    <Tooltip title={copied ? "Copied" : "Copy to clipboard"}>
      <Box
        sx={{
          marginLeft: 1,
          cursor: "pointer",
          display: "inline-block",
          "&:hover": { fill: "var(--mui-palette-text-primary)" },
        }}
        onClick={(event) => {
          event.stopPropagation()
          navigator.clipboard.writeText(value)

          setCopied(true)

          setTimeout(() => {
            setCopied(false)
          }, 1000)
        }}
      >
        {copied ? (
          <Check size={14} weight="regular" />
        ) : (
          <Copy fill="inherit" size={14} weight="regular" />
        )}
      </Box>
    </Tooltip>
  )
}
