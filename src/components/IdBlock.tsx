"use client"

import { Box, Link as MuiLink, Tooltip } from "@mui/material"
import React from "react"

import { Link } from "react-router-dom"

import { CopyToClipboard } from "./CopyToClipboard"

type IdBlockProps = {
  label: string
  value?: string
  href?: string
  hideTooltip?: boolean
}

export function IdBlock(props: IdBlockProps) {
  const { label, value, href, hideTooltip } = props

  const copyValue = value || label

  if (href) {
    return (
      <Box
        sx={{
          fill: "none",
          "&:hover": { fill: "var(--mui-palette-text-secondary)" },
        }}
      >
        <MuiLink
          component={Link}
          to={href}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <Tooltip title={hideTooltip ? null : value}>
            <Box
              sx={{
                display: "inline-block",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {label}
            </Box>
          </Tooltip>
        </MuiLink>
        <CopyToClipboard value={copyValue} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        fill: "none",
        "&:hover": { fill: "var(--mui-palette-text-secondary)" },
      }}
    >
      <Tooltip title={hideTooltip ? null : value}>
        <span>{label}</span>
      </Tooltip>
      <CopyToClipboard value={copyValue} />
    </Box>
  )
}
