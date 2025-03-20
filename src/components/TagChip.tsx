import { IconButton, Typography, TypographyProps } from "@mui/material"
import React from "react"

import { getColorFromText } from "@/utils/color-utils"

import { MonoFontFF } from "./RootLayout/fonts"
import { Check, Copy } from "@phosphor-icons/react"

export function TagChip(props: TypographyProps & { name: string; value: string }) {
  const { name, value } = props

  const [copied, setCopied] = React.useState(false)

  return (
    <Typography
      sx={{
        padding: 0.5,
        color: "black",
        background: getColorFromText(name),
      }}
      variant="caption"
      fontFamily={MonoFontFF}
    >
      {name}:{value}
      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
        sx={{
          width: 0,
          overflow: "hidden",
          p: 0,
          transition: "width 0.3s, transform 0.3s",
          color: "black",
          ".MuiTypography-root:hover &": {
            width: "auto",
            ml: 1,
            transform: "scale(1.2)",
          },
        }}
      >
        {copied ? <Check fontSize="small" color="#000" /> : <Copy fontSize="small" color="#000" />}
      </IconButton>
    </Typography>
  )
}
