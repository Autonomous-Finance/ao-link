"use client"

import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Asterisk } from "@phosphor-icons/react"
import React, { useCallback, useState } from "react"

import { MonoFontFF } from "@/components/RootLayout/fonts"

type ComputeResultProps = {
  messageId: string
  processId: string
}

export function ComputeResult(props: ComputeResultProps) {
  const { messageId, processId } = props
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCompute = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetch(
        `https://cu.ao-testnet.xyz/result/${messageId}?process-id=${processId}`,
      )
      const json = await result.json()
      if (!("Output" in json)) throw new Error(json.error)

      setContent(json.Output.data.output)
    } catch (error) {
      setContent(`Error computing result: ${String(error)}`)
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [messageId, processId])

  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Compute Result
        </Typography>
        <Button
          size="small"
          sx={{
            bgcolor: "var(--mui-palette-primary-main) !important",
            height: "fit-content",
          }}
          variant="contained"
          onClick={handleCompute}
          disabled={loading}
          endIcon={
            loading ? (
              <CircularProgress size={12} sx={{ color: "inherit" }} />
            ) : (
              <Asterisk width={12} height={12} weight="bold" />
            )
          }
        >
          Compute
        </Button>
      </Stack>
      <TextField
        sx={(theme) => ({
          bgcolor: "var(--mui-palette-background-paper)",
          "& textarea": {
            ...theme.typography.body2,
            fontFamily: MonoFontFF,
            resize: "both",
            minWidth: "100%",
            minHeight: 200,
          },
        })}
        rows={1}
        multiline
        variant="outlined"
        placeholder={
          loading ? "Loading..." : "Click 'Compute' to get the result."
        }
        value={content}
      />
    </Stack>
  )
}
