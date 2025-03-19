"use client"

import { Button, CircularProgress, Paper, Stack, Typography } from "@mui/material"
import { result } from "@permaweb/aoconnect"
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result"
import { Asterisk } from "@phosphor-icons/react"
import React, { useCallback, useEffect, useState } from "react"

import { FormattedDataBlock } from "@/components/FormattedDataBlock"
import { getMessageById } from "@/services/messages-api"
import { AoMessage } from "@/types"
import { prettifyResult } from "@/utils/ao-utils"

type ComputeResultProps = {
  messageId: string
  processId: string
  autoCompute?: boolean
  onComputedResult?: (result: MessageResult | null) => void
}

export function ComputeResult(props: ComputeResultProps) {
  const { messageId, processId, autoCompute = false, onComputedResult } = props
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  // undefined = loading
  // null = not found
  const [msg, setMsg] = React.useState<AoMessage | undefined | null>(undefined)

  useEffect(() => {
    if (!processId) {
      setMsg(null)
      return
    }

    getMessageById(processId).then(setMsg)
  }, [processId])

  const handleCompute = useCallback(async () => {
    setLoading(true)
    try {
      const json = await result({
        message: messageId,
        process: processId,
      })
      onComputedResult?.(json)
      setContent(JSON.stringify(prettifyResult(json), null, 2))
    } catch (error) {
      console.error(error)
      setContent(String(error))
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [messageId, processId])

  useEffect(() => {
    if (msg === undefined) return

    if (autoCompute && msg) {
      handleCompute()
    }
    if (autoCompute && msg === null) {
      onComputedResult?.(null)
    }
  }, [msg, autoCompute])

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
          msg === null
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
