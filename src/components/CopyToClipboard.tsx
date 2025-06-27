"use client"

import { Tooltip, IconButton } from "@mui/material"
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
    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
      {/* Wrap with a span to ensure Tooltip has a valid child when IconButton is disabled (though not used here) */}
      <span>
        <IconButton
          size="small" // Standard MUI IconButton sizes are good for touch
          onClick={(event) => {
            event.stopPropagation()
            navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => {
              setCopied(false)
            }, 1500) // Increased timeout slightly
          }}
          sx={{
            color: "var(--mui-palette-text-primary)",
            // marginLeft: 0.5, // IconButton often has some inherent padding, adjust if needed
            // p: 0.25, // IconButton has its own padding, fine-tune if necessary
            "&:hover": {
              // color: "var(--mui-palette-text-primary)", // Ensure icon color changes on hover if desired
            },
            "& .MuiSvgIcon-root": { // If Phosphor icons are treated as SvgIcon by sx
              fontSize: 18, // Slightly larger icon
            }
          }}
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check size={18} weight="bold" color="var(--mui-palette-success-main)" /> // Use theme color for success
          ) : (
            <Copy size={18} weight="regular" color="var(--mui-palette-text-primary)" />
          )}
        </IconButton>
      </span>
    </Tooltip>
  )
}
