import { IconButton, Typography, TypographyProps } from "@mui/material"
import { Check, Copy } from "@phosphor-icons/react"
import React from "react"

import { MonoFontFF } from "./RootLayout/fonts"
import { getColorFromText } from "@/utils/color-utils"

import { isArweaveId } from "@/utils/utils"

export function TagChip(
  props: TypographyProps & { name: string; value: string; copyOnlyValue?: boolean },
) {
  const { name, value, copyOnlyValue = false } = props

  const [copied, setCopied] = React.useState(false)
  const valuesIsArweaveAddress = isArweaveId(value)

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
      {valuesIsArweaveAddress ? (
        <a
          href={`/#/entity/${value}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {name}:{value}
        </a>
      ) : (
        <span>
          {name}:{value}
        </span>
      )}
      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          navigator.clipboard.writeText(copyOnlyValue ? value : `${name}:${value}`)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
        sx={{
          width: 24,
          minWidth: 24,
          height: 24,
          opacity: 0.5,
          ml: 1,
          p: 0,
          transition: "opacity 0.3s, transform 0.3s",
          color: "black",
          "&:hover": {
            opacity: 1,
            transform: "scale(1.2)",
          },
        }}
      >
        {copied ? <Check fontSize="small" color="#000" /> : <Copy fontSize="small" color="#000" />}
      </IconButton>
    </Typography>
  )
}
