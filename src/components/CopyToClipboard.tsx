"use client"

import { Tooltip, IconButton } from "@mui/material"
import { Check, Copy } from "@phosphor-icons/react"
import React from "react"

// Add CSS for hover/touch behavior
const styles = `
.copy-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.copy-btn {
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}
.copy-container:hover .copy-btn,
.copy-container:focus-within .copy-btn,
.copy-container.show-copy .copy-btn {
  opacity: 1;
  pointer-events: auto;
}
`;

// Inject the style tag once
if (typeof window !== "undefined" && !document.getElementById("copy-to-clipboard-style")) {
  const style = document.createElement("style");
  style.id = "copy-to-clipboard-style";
  style.innerHTML = styles;
  document.head.appendChild(style);
}

type CopyToClipboardProps = {
  value: string
}

export function CopyToClipboard(props: CopyToClipboardProps) {
  const { value } = props
  const [copied, setCopied] = React.useState(false)
  const [showCopy, setShowCopy] = React.useState(false)
  const touchTimeout = React.useRef<NodeJS.Timeout | null>(null)

  if (!value) return null

  // Show copy button for a short time on touch (mobile)
  const handleTouchStart = (_e: React.TouchEvent) => {
    setShowCopy(true)
    if (touchTimeout.current) clearTimeout(touchTimeout.current)
    touchTimeout.current = setTimeout(() => setShowCopy(false), 2000)
  }

  return (
    <span
      className={`copy-container${showCopy ? " show-copy" : ""}`}
      onTouchStart={handleTouchStart}
      tabIndex={-1}
      style={{ outline: "none" }}
    >
      <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
        <span>
          <IconButton
            className="copy-btn"
            size="small"
            onClick={(event) => {
              event.stopPropagation()
              navigator.clipboard.writeText(value)
              setCopied(true)
              setTimeout(() => {
                setCopied(false)
              }, 1500)
            }}
            sx={{
              color: "var(--mui-palette-text-primary)",
              "& .MuiSvgIcon-root": {
                fontSize: 18,
              }
            }}
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check size={18} weight="bold" color="var(--mui-palette-success-main)" />
            ) : (
              <Copy size={18} weight="regular" color="var(--mui-palette-text-primary)" />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </span>
  )
}
