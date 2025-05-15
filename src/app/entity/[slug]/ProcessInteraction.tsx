import { useActiveAddress } from "@arweave-wallet-kit/react"
import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { createDataItemSigner, dryrun, message, result } from "@permaweb/aoconnect"
import { DryRunResult, MessageInput } from "@permaweb/aoconnect/dist/lib/dryrun"
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result"
import { Asterisk } from "@phosphor-icons/react"
import { RequestHistoryPanel } from "@/components/RequestHistoryPanel"

import React, { useCallback, useState } from "react"

import { CodeEditor } from "@/components/CodeEditor"
import { FormattedDataBlock } from "@/components/FormattedDataBlock"
import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { prettifyResult } from "@/utils/ao-utils"
import { truncateId } from "@/utils/data-utils"

type ProcessInteractionProps = {
  processId: string
  readOnly?: boolean
}

export function ProcessInteraction(props: ProcessInteractionProps) {
  const { processId, readOnly } = props
  const [response, setResponse] = useState("")
  const [msgId, setMsgId] = useState("")
  const [loading, setLoading] = useState(false)
  const activeAddress = useActiveAddress()

  const [query, setQuery] = useState<string | undefined>(
    JSON.stringify(
      {
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "Info" }],
      },
      null,
      2,
    ),
  )

  const handleFetch = useCallback(async () => {
    setLoading(true)
    setMsgId("")
    try {
      const msg = JSON.parse(query as string) as MessageInput

      let json: DryRunResult | MessageResult | undefined

      if (readOnly) {
        json = await dryrun(msg)

        const newItem = {
          id: crypto.randomUUID(),
          processId,
          request: msg,
          response: json,
          timestamp: new Date().toISOString()
        }

        const existing = JSON.parse(localStorage.getItem("dryRunHistory") || "[]")
        const updated = [...existing.slice(-9), newItem]
        localStorage.setItem("dryRunHistory", JSON.stringify(updated))

    } else {
      // “Send message” branch
      const sentMsgId = await message({
        ...msg,
        signer: createDataItemSigner(window.arweaveWallet),
      })
      json = await result({ message: sentMsgId, process: processId })
      setMsgId(sentMsgId)

      const newItem = {
        id: crypto.randomUUID(),
        processId,
        request: msg,
        response: json,
        timestamp: new Date().toISOString(),
        sentMessageId: sentMsgId,
      }
      const existing = JSON.parse(localStorage.getItem("dryRunHistory") || "[]")
      const updated = [...existing.slice(-9), newItem]
      localStorage.setItem("dryRunHistory", JSON.stringify(updated))
    }
      setResponse(JSON.stringify(prettifyResult(json), null, 2))
    } catch (error) {
      setResponse(JSON.stringify({ error: `Error fetching info: ${String(error)}` }, null, 2))
    }
    setLoading(false)
  }, [processId, query, readOnly])

  return (
    <Box sx={{ marginBottom: 10, marginTop: 3, marginX: 2 }}>
      <Stack gap={1}>
        <Grid2 container spacing={{ xs: 4, lg: 2 }}>
          <Grid2 xs={12} lg={6}>
            <Box sx={{ position: "relative" }}>
              <Paper
                component={CodeEditor}
                height={600}
                defaultLanguage="json"
                defaultValue={query}
                onChange={(value) => setQuery(value)}
              />
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -24,
                  left: 0,
                  border: "1px solid var(--mui-palette-divider)",
                  background: "var(--mui-palette-background-paper)",
                  borderBottom: 0,
                  paddingTop: 0.5,
                  paddingLeft: 2,
                  paddingRight: 2,
                  zIndex: "var(--mui-zIndex-appBar)",
                }}
              >
                Query
              </Typography>
            </Box>
          </Grid2>
          <Grid2 xs={12} lg={6}>
            <Box sx={{ position: "relative" }}>
              <Paper
                component={FormattedDataBlock}
                minHeight="unset"
                height={600}
                maxHeight={600}
                data={response}
                placeholder={
                  loading
                    ? "Loading..."
                    : `Click '${readOnly ? "Dry run" : "Send message"}' to get the result.`
                }
              />
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: -24,
                  left: 0,
                  border: "1px solid var(--mui-palette-divider)",
                  background: "var(--mui-palette-background-paper)",
                  borderBottom: 0,
                  paddingTop: 0.5,
                  paddingLeft: 2,
                  paddingRight: 2,
                  zIndex: "var(--mui-zIndex-appBar)",
                }}
              >
                Result
              </Typography>
            </Box>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={{ xs: 1, lg: 2 }}>
          <Grid2 xs={12} lg={6}></Grid2>
          <Grid2 xs={12} lg={6}>
            <Stack direction="row" justifyContent="space-between" gap={1} alignItems="center">
              {msgId ? (
                <Typography
                  variant="body2"
                  fontFamily={MonoFontFF}
                  component={Stack}
                  direction="row"
                  gap={1}
                  marginX={1}
                >
                  Message ID:
                  <IdBlock label={truncateId(msgId)} value={msgId} href={`/message/${msgId}`} />
                </Typography>
              ) : (
                <div />
              )}
              {(readOnly || activeAddress) && (
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={handleFetch}
                  disabled={loading}
                  endIcon={
                    loading ? (
                      <CircularProgress size={12} color="inherit" />
                    ) : readOnly ? null : (
                      <Asterisk width={12} height={12} weight="bold" />
                    )
                  }
                >
                  {readOnly ? "Dry run" : "Send message"}
                </Button>
              )}
              {!readOnly && !activeAddress && (
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    document.getElementById("connect-wallet-button")?.click()
                  }}
                >
                  Connect wallet
                </Button>
              )}
            </Stack>
          </Grid2>
        </Grid2>

        <Box sx={{ mt: 4 }}>
          <RequestHistoryPanel onSelect={(value) => setQuery(value)} />
        </Box>
      </Stack>
    </Box>
  )
}
