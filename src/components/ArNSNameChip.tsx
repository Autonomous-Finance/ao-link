import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material"
import { Globe } from "@phosphor-icons/react"
import { ReactNode } from "react"

interface ArNSNameChipProps {
  name: string
  showIcon?: boolean
  variant?: "filled" | "outlined"
  size?: "small" | "medium"
  onClick?: () => void
  startAdornment?: ReactNode
  endAdornment?: ReactNode
}

/**
 * Component for displaying ArNS names with a distinctive globe icon
 */
export function ArNSNameChip({
  name,
  showIcon = true,
  variant = "outlined",
  size = "small",
  onClick,
  startAdornment,
  endAdornment,
}: ArNSNameChipProps) {
  return (
    <Tooltip title={`ArNS name: ${name}`} arrow>
      <Chip
        label={
          <Stack direction="row" alignItems="center" gap={0.5}>
            {startAdornment}
            {showIcon && (
              <Globe 
                size={size === "small" ? 14 : 16} 
                weight="duotone"
                style={{ color: "#1976d2" }}
              />
            )}
            <Typography 
              variant="inherit" 
              component="span"
              sx={{ 
                fontFamily: "monospace",
                fontSize: size === "small" ? "0.75rem" : "0.875rem"
              }}
            >
              {name}
            </Typography>
            {endAdornment}
          </Stack>
        }
        variant={variant}
        size={size}
        onClick={onClick}
        sx={{
          backgroundColor: variant === "filled" ? "#e3f2fd" : "transparent",
          borderColor: "#1976d2",
          color: "#1976d2",
          "& .MuiChip-label": {
            padding: "2px 6px",
          },
          "&:hover": {
            backgroundColor: "#e3f2fd",
            cursor: onClick ? "pointer" : "default",
          },
        }}
      />
    </Tooltip>
  )
}

interface ArNSNameDisplayProps {
  name: string
  showIcon?: boolean
  inline?: boolean
  onClick?: () => void
}

/**
 * Simple inline display component for ArNS names
 */
export function ArNSNameDisplay({
  name,
  showIcon = true,
  inline = true,
  onClick,
}: ArNSNameDisplayProps) {
  const content = (
    <Stack 
      direction="row" 
      alignItems="center" 
      gap={0.5}
      sx={{
        display: inline ? "inline-flex" : "flex",
        color: "#1976d2",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? {
          textDecoration: "underline",
        } : undefined,
      }}
      onClick={onClick}
    >
      {showIcon && (
        <Globe 
          size={14} 
          weight="duotone"
          style={{ color: "#1976d2" }}
        />
      )}
      <Typography 
        variant="body2" 
        component={inline ? "span" : "div"}
        sx={{ 
          fontFamily: "monospace",
          color: "inherit",
        }}
      >
        {name}
      </Typography>
    </Stack>
  )

  if (onClick) {
    return (
      <Tooltip title={`ArNS name: ${name}`} arrow>
        {content}
      </Tooltip>
    )
  }

  return content
}