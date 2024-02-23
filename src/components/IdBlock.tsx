"use client"

import { Box, Tooltip } from "@mui/material"
import Link from "next/link"
import React from "react"

import { CopyToClipboard } from "./CopyToClipboard"

type IdBlockProps = {
  label: string
  value?: string
  href?: string
}

export function IdBlock(props: IdBlockProps) {
  const { label, value, href } = props

  const copyValue = value || label

  if (href) {
    return (
      <Box
        sx={{
          fill: "none",
          "&:hover": { fill: "var(--mui-palette-text-secondary)" },
        }}
      >
        <Link
          href={href}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <Tooltip title={value}>
            <Box
              sx={{
                display: "inline-block",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {label}
            </Box>
          </Tooltip>
        </Link>
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
      <Tooltip title={value}>
        <span>{label}</span>
      </Tooltip>
      <CopyToClipboard value={copyValue} />
    </Box>
  )
}
