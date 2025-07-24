import {
  Box,
  BoxProps,
  Typography,
  useTheme,
  IconButton,
  Dialog,
  Tooltip,
  Stack,
} from "@mui/material"
import { ArrowsIn, ArrowsOut } from "@phosphor-icons/react"
import AnsiToHtml from "ansi-to-html"
import React, { useMemo, useState } from "react"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json"
import lua from "react-syntax-highlighter/dist/esm/languages/hljs/lua"
import { github, vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs"

import { CopyToClipboard } from "./CopyToClipboard"
import { MonoFontFF } from "@/components/RootLayout/fonts"

import JSONbig from "json-bigint"

SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("lua", lua)

type FormattedDataBlockProps = BoxProps & {
  data?: string
  placeholder?: string
  isEvalMessage?: boolean
  minHeight?: number | string
  maxHeight?: number | string
}

export function FormattedDataBlock(props: FormattedDataBlockProps) {
  const { data: rawData, placeholder, isEvalMessage, minHeight = 250, maxHeight, ...rest } = props

  const theme = useTheme()

  const [data, type] = useMemo(() => {
    if (!rawData) return [placeholder || "...", "string"]
    if (isEvalMessage) return [rawData, "lua"]

    try {
      const json = JSONbig.parse(rawData)
      let formatted = JSON.stringify(json, null, 2)
      // if the json object has nested ansi strings, we strip them away
      formatted = formatted.replace(/\\u001b\[\d{1,2}(;\d{1,2})*m/g, "")
      return [formatted, "json"]
    } catch (error) {
      const ansiConverter = new AnsiToHtml()
      const formatted = ansiConverter.toHtml(rawData)
      return [formatted, "ansi"]
    }
  }, [rawData, placeholder])

  const [fullscreen, setFullscreen] = useState(false)
  const toggleFullscreen = () => {
    setFullscreen((prev) => !prev)
  }

  const content = (
    <Box
      sx={(theme) => ({
        position: "relative",
        border: fullscreen ? "none" : undefined,
        "& *": {
          ...theme.typography.body2,
          fontFamily: MonoFontFF,
        },
        "& > *:not(.action-bar)": {
          minWidth: "100%",
          width: "1px", // to force the horizontal scrollbar
          minHeight: fullscreen ? "100vh" : minHeight,
          height: fullscreen ? "100vh" : minHeight,
          maxHeight,
          overflow: "auto",
          resize: fullscreen || minHeight === "unset" ? undefined : "vertical",
          margin: 0,
          padding: "8px 16px !important",
        },
      })}
      {...rest}
    >
      {!!rawData && (
        <Stack
          className="action-bar"
          sx={{
            position: "absolute",
            top: 0,
            right: 14,
            padding: 1,
            fill: "var(--mui-palette-primary-main)",
          }}
          direction="row"
          gap={1}
        >
          <CopyToClipboard value={rawData} />
          <Tooltip title="Toggle fullscreen">
            <IconButton
              onClick={toggleFullscreen}
              sx={{ padding: 0, marginTop: "-2px" }}
              disableFocusRipple
            >
              {!fullscreen ? (
                <ArrowsOut fill="inherit" size={14} />
              ) : (
                <ArrowsIn fill="inherit" size={14} />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      )}
      {type === "string" ? (
        <Box>
          <Typography color="text.secondary" variant="inherit">
            {data}
          </Typography>
        </Box>
      ) : type === "json" ? (
        <SyntaxHighlighter
          language="json"
          style={theme.palette.mode === "light" ? github : vs2015}
          wrapLines
          wrapLongLines
          showLineNumbers={fullscreen}
        >
          {data}
        </SyntaxHighlighter>
      ) : type === "lua" ? (
        <SyntaxHighlighter
          language="lua"
          style={theme.palette.mode === "light" ? github : vs2015}
          wrapLines
          wrapLongLines
          showLineNumbers={fullscreen}
        >
          {data}
        </SyntaxHighlighter>
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: data,
          }}
        />
      )}
    </Box>
  )

  if (!fullscreen) return content

  return (
    <Dialog
      open
      fullScreen
      onClose={toggleFullscreen}
      PaperProps={{ sx: { border: 0 } }}
      transitionDuration={0}
    >
      {content}
    </Dialog>
  )
}
