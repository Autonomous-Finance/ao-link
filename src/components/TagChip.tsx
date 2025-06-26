import { IconButton, Typography, TypographyProps, Box } from "@mui/material"
import React from "react"

import { getColorFromText } from "@/utils/color-utils"

import { MonoFontFF } from "./RootLayout/fonts"
import { Check, Copy } from "@phosphor-icons/react"
import { isArweaveId } from "@/utils/utils"

export function TagChip(props: TypographyProps & { name: string; value: string }) {
  const { name, value } = props

  const [copied, setCopied] = React.useState(false)
  const valuesIsArweaveAddress = isArweaveId(value)

  return (
    <Typography
      component="span" // Use span for better inline-block behavior with IconButton
      sx={{
        display: 'inline-flex', // To align items nicely
        alignItems: 'center',
        padding: theme => theme.spacing(0.75, 1.25), // Increased padding: 6px top/bottom, 10px left/right
        color: "black",
        background: getColorFromText(name),
        borderRadius: '16px', // Give it a chip-like appearance
        overflow: 'hidden', // Ensure content fits
        textOverflow: 'ellipsis', // Add ellipsis for long text
        whiteSpace: 'nowrap', // Prevent wrapping of name:value
        maxWidth: '100%', // Ensure it doesn't overflow its container in flex layouts
      }}
      variant="caption"
      fontFamily={MonoFontFF}
    >
      <Box
        component="span" // Inner span for text to allow ellipsis
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flexShrink: 1, // Allow text to shrink
        }}
      >
        {valuesIsArweaveAddress ? (
          <a
            href={`/#/entity/${value}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={(e) => e.stopPropagation()} // Prevent Typography's potential event handlers
          >
            {name}:{value}
          </a>
        ) : (
          <span>
            {name}:{value}
          </span>
        )}
      </Box>
      <IconButton
        size="small" // Ensure a decent touch target
        onClick={(e) => {
          e.stopPropagation()
          navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500) // Aligned to 1500ms
        }}
        sx={{
          ml: 0.5, // Margin left to space from text
          p: 0.25, // Small padding for the icon button itself
          color: "black",
          // Basic visual feedback on tap for mobile
          "&:active": {
            transform: "scale(0.9)",
          },
        }}
        aria-label={`Copy value for ${name}`}
      >
        {copied ? <Check size={16} color="#000" /> : <Copy size={16} color="#000" />}
      </IconButton>
    </Typography>
  )
}
