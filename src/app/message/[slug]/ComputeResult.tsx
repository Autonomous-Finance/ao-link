"use client"

import { Button, CircularProgress, Paper, Stack, Typography } from "@mui/material"
import { result } from "@permaweb/aoconnect"
import { Asterisk } from "@phosphor-icons/react"
import React, { useCallback, useEffect, useState } from "react"

import { FormattedDataBlock } from "@/components/FormattedDataBlock"
import { getMessageById } from "@/services/messages-api"
import { AoMessage } from "@/types"
import { prettifyResult } from "@/utils/ao-utils"

type ComputeResultProps = {
  messageId: string
  processId: string
}

export function ComputeResult(props: ComputeResultProps) {
  const { messageId, processId } = props
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const [msg, setMsg] = React.useState<AoMessage | undefined | null>(null)

  useEffect(() => {
    if (!processId) return

    getMessageById(processId).then(setMsg)
  }, [processId])

  const handleCompute = useCallback(async () => {
    setLoading(true)
    try {
      const json = await result({
        message: messageId,
        process: processId,
      })
      setContent(JSON.stringify(prettifyResult(json), null, 2))
    } catch (error) {
      console.error(error)
      setContent(String(error))
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
          color="secondary"
          variant="contained"
          onClick={handleCompute}
          disabled={!msg || loading}
          endIcon={
            loading ? (
              <CircularProgress size={12} color="inherit" />
            ) : (
              <Asterisk width={12} height={12} weight="bold" />
            )
          }
        >
          Compute
        </Button>
      </Stack>
      <FormattedDataBlock
        data={content}
        placeholder={
          msg === undefined
            ? "There is no result to compute because the message was sent to a User."
            : loading
              ? "Loading..."
              : "Click 'Compute' to get the result."
        }
        component={Paper}
      />
    </Stack>
  )
}
