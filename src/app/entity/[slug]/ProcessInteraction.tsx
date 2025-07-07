import { useStore } from "@nanostores/react"
import { atom } from "nanostores"
import React, { useCallback, useMemo, useState } from "react"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { Box, Button, CircularProgress, Paper, Stack, Typography, TextField } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { createDataItemSigner, dryrun, message, result } from "@permaweb/aoconnect"
import { DryRunResult, MessageInput } from "@permaweb/aoconnect/dist/lib/dryrun"
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result"
import { Asterisk } from "@phosphor-icons/react"

import { CodeEditor } from "@/components/CodeEditor"
import { FormattedDataBlock } from "@/components/FormattedDataBlock"
import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { prettifyResult } from "@/utils/ao-utils"
import { truncateId } from "@/utils/data-utils"

import { RequestHistoryPanel, dryRunHistoryStore, addToDryRunHistory } from "@/components/RequestHistoryPanel"
import { getPredefinedTemplates, Template } from './predefinedTemplates'

// Types

// Template store helper
const templateStoreMap: Record<string, ReturnType<typeof atom<Template[]>>> = {}
function getTemplateStore(key: string, processId: string) {
  if (!templateStoreMap[key]) {
    let initial: Template[] = []
    try {
      const stored = localStorage.getItem(key)
      if (stored) initial = JSON.parse(stored)
    } catch {}
    // Add predefined templates if not present
    const predefined = getPredefinedTemplates(processId)
    for (const t of predefined) {
      if (!initial.some((x) => x.id === t.id)) {
        initial.unshift(t)
      }
    }
    // Separate user templates from predefined
    const userTemplates = initial.filter(t => !predefined.some(p => p.id === t.id))
    // Cap user templates at 5
    const cappedUserTemplates = userTemplates.slice(-5)
    // Final list: always include all predefined, then capped user templates
    initial = [...predefined, ...cappedUserTemplates]
    const store = atom<Template[]>(initial)
    store.listen((list) => {
      try {
        localStorage.setItem(key, JSON.stringify(list))
      } catch {}
    })
    templateStoreMap[key] = store
  }
  return templateStoreMap[key]
}

type ProcessInteractionProps = {
  processId: string
  readOnly?: boolean
}

export function ProcessInteraction({ processId, readOnly }: ProcessInteractionProps) {
  // Wallet & basic query state
  const activeAddress = useActiveAddress()
  const defaultQuery = useMemo(
    () =>
      JSON.stringify(
        { process: processId, data: "", tags: [{ name: "Action", value: "Info" }] },
        null,
        2,
      ),
    [processId],
  )

  const [query, setQuery] = useState<string>(defaultQuery)
  const [response, setResponse] = useState<string>("")
  const [msgId, setMsgId] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  // Template management
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>("")
  const [newId, setNewId] = useState<string>("")
  const STORAGE_KEY = `processInteractionTemplates_${processId}`
  const templatesStore = useMemo(() => getTemplateStore(STORAGE_KEY, processId), [STORAGE_KEY, processId])
  const templates = useStore(templatesStore)

  const loadTemplate = (id: string | null, payload: string) => {
    setQuery(payload)
    setSelectedId(id)
    setIsAdding(false)
  }
  const startAdd = () => {
    setIsAdding(true)
    setSelectedId(null)
    setNewName("")
    setNewId(crypto.randomUUID())
    setQuery("")
  }
  const saveTemplate = () => {
    // Always keep predefined templates
    const predefined = getPredefinedTemplates(processId)
    const userTemplates = templates.filter(t => !predefined.some(p => p.id === t.id))
    let newUserTemplates = [...userTemplates, { id: newId, name: newName, payload: query }]
    if (newUserTemplates.length > 5) {
      // Remove the oldest user template (first in the array)
      newUserTemplates = newUserTemplates.slice(1)
    }
    templatesStore.set([...predefined, ...newUserTemplates])
    setSelectedId(newId)
    setIsAdding(false)
  }
  const deleteTemplate = () => {
    if (!selectedId) return
    templatesStore.set(templates.filter((t) => t.id !== selectedId))
    loadTemplate(null, defaultQuery)
  }

  // Fetch handler
  const handleFetch = useCallback(async () => {
    setLoading(true)
    setMsgId("")
    try {
      const msg = JSON.parse(query) as MessageInput
      let json: DryRunResult | MessageResult

      if (readOnly) {
        json = await dryrun(msg)
        const entry = { id: crypto.randomUUID(), processId, request: msg, response: json, timestamp: new Date().toISOString() }
        addToDryRunHistory(entry)
      } else {
        const sid = await message({ ...msg, signer: createDataItemSigner(window.arweaveWallet) })
        json = await result({ message: sid, process: processId })
        setMsgId(sid)
        const entry = { id: crypto.randomUUID(), processId, request: msg, response: json, timestamp: new Date().toISOString(), sentMessageId: sid }
        addToDryRunHistory(entry)
      }

      setResponse(JSON.stringify(prettifyResult(json), null, 2))
    } catch (err) {
      setResponse(JSON.stringify({ error: `Error fetching info: ${String(err)}` }, null, 2))
    }
    setLoading(false)
  }, [processId, query, readOnly])

  return (
    <Box sx={{ my: 3, mx: 2, mb: 10 }}>
      <Stack gap={1}>
        {/* QUERY & TEMPLATE TABS */}
        <Grid2 container spacing={{ xs: 4, lg: 2 }}>
          <Grid2 xs={12} lg={6}>
            <Box sx={{ position: "relative" }}>
              <Box sx={{ position: "absolute", top: -24, left: 0, display: "flex", zIndex: "var(--mui-zIndex-appBar)" }}>
                <Typography variant="caption" onClick={() => loadTemplate(null, defaultQuery)} sx={{ border: "1px solid var(--mui-palette-divider)", background: "var(--mui-palette-background-paper)", borderBottom: 0, px: 2, pt: 0.5, cursor: "pointer" }}>Query</Typography>
                {templates.map((t) => (
                  <Typography key={t.id} variant="caption" onClick={() => loadTemplate(t.id, t.payload)} sx={{ border: "1px solid var(--mui-palette-divider)", background: "var(--mui-palette-background-paper)", borderBottom: 0, px: 2, pt: 0.5, cursor: "pointer" }}>{t.name}</Typography>
                ))}
                <Typography variant="caption" onClick={startAdd} sx={{ border: "1px solid var(--mui-palette-divider)", background: "var(--mui-palette-background-paper)", borderBottom: 0, px: 2, pt: 0.5, cursor: "pointer" }}>＋</Typography>
              </Box>
              <Paper component={CodeEditor} height={600} defaultLanguage="json" value={query} onChange={(v) => typeof v === "string" && setQuery(v)} />
            </Box>
          </Grid2>

          <Grid2 xs={12} lg={6}>
            <Box sx={{ position: "relative" }}>
              <Paper component={FormattedDataBlock} minHeight="unset" height={600} maxHeight={600} data={response} placeholder={ loading ? "Loading..." : `Click '${readOnly ? "Dry run" : "Send message"}' to get the result.` } />
              <Typography variant="caption" sx={{ position: "absolute", top: -24, left: 0, border: "1px solid var(--mui-palette-divider)", background: "var(--mui-palette-background-paper)", borderBottom: 0, px: 2, pt: 0.5, zIndex: "var(--mui-zIndex-appBar)" }}>Result</Typography>
            </Box>
          </Grid2>
        </Grid2>

        {/* TEMPLATE ACTIONS & SEND */}
        <Grid2 container spacing={{ xs: 1, lg: 2 }}>
          <Grid2 xs={12} lg={6}>
            {(isAdding || selectedId) && (
              <Stack direction="row" spacing={1} alignItems="center">
                {isAdding ? (
                  <> <TextField size="small" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} /> <Button size="small" variant="contained" disabled={!newName} onClick={saveTemplate}>Save</Button> </>
                ) : (
                  <Button size="small" color="error" variant="outlined" onClick={deleteTemplate}>Delete Template</Button>
                )}
              </Stack>
            )}
          </Grid2>
          <Grid2 xs={12} lg={6}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
              {msgId ? (
                <Typography variant="body2" fontFamily={MonoFontFF} component={Stack} direction="row" gap={1} mx={1}>
                  Message ID:
                  <IdBlock label={truncateId(msgId)} value={msgId} href={`/message/${msgId}`} />
                </Typography>
              ) : <div />}

              { (readOnly || activeAddress) ? (
                <Button size="small" color="secondary" variant="contained" onClick={handleFetch} disabled={loading} endIcon={ loading ? <CircularProgress size={12} color="inherit" /> : (!readOnly && <Asterisk width={12} height={12} weight="bold" />) }>
                  {readOnly ? "Dry run" : "Send message"}
                </Button>
              ) : (
                <Button size="small" variant="contained" color="secondary" onClick={() => document.getElementById("connect-wallet-button")?.click()}>Connect wallet</Button>
              ) }
            </Stack>
          </Grid2>
        </Grid2>

        {/* HISTORY */}
        <Box sx={{ mt: 4 }}>
          <RequestHistoryPanel onSelect={(val) => loadTemplate(null, val)} />
        </Box>
      </Stack>
    </Box>
  )
}