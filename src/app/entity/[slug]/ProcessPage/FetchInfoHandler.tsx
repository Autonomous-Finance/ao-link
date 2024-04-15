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

type FetchInfoHandlerProps = {
  processId: string
}

export function FetchInfoHandler(props: FetchInfoHandlerProps) {
  const { processId } = props
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFetch = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetch(
        `https://cu.ao-testnet.xyz/dry-run?process-id=${processId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Anchor: "0",
            Data: "1234",
            Id: "1234",
            Owner: "1234",
            Target: processId,
            Tags: [{ name: "Action", value: "Info" }],
          }),
        },
      )
      const json = await result.json()

      if ("error" in json) {
        throw new Error(json.error)
      }

      if (
        "Messages" in json &&
        json.Messages.length > 0 &&
        typeof json.Messages[0] === "object"
      ) {
        setContent(JSON.stringify(json.Messages[0], null, 2))
      } else {
        setContent(JSON.stringify(json, null, 2))
      }
    } catch (error) {
      setContent(`Error fetching info: ${String(error)}`)
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [processId])

  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" color="text.secondary">
          Info Handler
        </Typography>
        <Button
          size="small"
          sx={{
            bgcolor: "var(--mui-palette-secondary-main) !important",
            color: "black",
            height: "fit-content",
          }}
          variant="contained"
          onClick={handleFetch}
          disabled={loading}
          endIcon={
            loading ? (
              <CircularProgress size={12} color="inherit" />
            ) : (
              <Asterisk width={12} height={12} weight="bold" />
            )
          }
        >
          Fetch
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
          loading
            ? "Loading..."
            : "Click 'Fetch' to get information about this process."
        }
        value={content}
      />
    </Stack>
  )
}
