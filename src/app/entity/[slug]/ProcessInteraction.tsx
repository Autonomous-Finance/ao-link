import { useActiveAddress } from "@arweave-wallet-kit/react"
import { Box, Button, CircularProgress, Paper, Stack, Typography, TextField } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"

import { useStore } from "@nanostores/react"
import { createDataItemSigner, dryrun, message, result } from "@permaweb/aoconnect"
import { DryRunResult, MessageInput } from "@permaweb/aoconnect/dist/lib/dryrun"
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result"
import { Asterisk } from "@phosphor-icons/react"
import { atom } from "nanostores"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import { CodeEditor } from "@/components/CodeEditor"
import { FormattedDataBlock } from "@/components/FormattedDataBlock"
import { IdBlock } from "@/components/IdBlock"
import { RequestHistoryPanel, dryRunHistoryStore } from "@/components/RequestHistoryPanel"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { prettifyResult } from "@/utils/ao-utils"
import { truncateId } from "@/utils/data-utils"

// Types

type ProcessInteractionProps = {
  processId: string
  readOnly?: boolean
}

type Template = { id: string; name: string; payload: string }

// Template store helper
const templateStoreMap: Record<string, ReturnType<typeof atom<Template[]>>> = {}
function getTemplateStore(key: string) {
  if (!templateStoreMap[key]) {
    let initial: Template[] = []
    try {
      const stored = localStorage.getItem(key)
      if (stored) initial = JSON.parse(stored)
    } catch {}
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
  const templatesStore = useMemo(() => getTemplateStore(STORAGE_KEY), [STORAGE_KEY])
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
    templatesStore.set([...templates, { id: newId, name: newName, payload: query }])
    setSelectedId(newId)
    setIsAdding(false)
  }
  const deleteTemplate = () => {
    if (!selectedId) return
    templatesStore.set(templates.filter((t) => t.id !== selectedId))
    loadTemplate(null, defaultQuery)
  }

  // Hyperbeam integration
  const HB_BASE = `https://hb.zoao.dev/${processId}~process@1.0`
  const [isHB, setIsHB] = useState<boolean>(false)
  const [hbKeys, setHbKeys] = useState<string[]>([])
  const [slotCurrent, setSlotCurrent] = useState<any>(null)
  const [computeAtSlot, setComputeAtSlot] = useState<any>(null)

  useEffect(() => {
    fetch(`${HB_BASE}/compute/keys/serialize~json@1.0`)
      .then((res) => {
        if (!res.ok) throw new Error("no HB")
        return res.json()
      })
      .then((json) => {
        setIsHB(true)
        setHbKeys(Array.isArray(json) ? json : [])
        return Promise.all([
          fetch(`${HB_BASE}/slot/current`).then((r) => r.json()),
          fetch(`${HB_BASE}/compute/at-slot`).then((r) => r.json()),
        ])
      })
      .then(([slotJson, atSlotJson]) => {
        setSlotCurrent(slotJson)
        setComputeAtSlot(atSlotJson)
      })
      .catch(() => setIsHB(false))
  }, [processId])

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
        const hist = dryRunHistoryStore.get() || []
        dryRunHistoryStore.set([...hist, entry].slice(-10))
      } else {
        const sid = await message({ ...msg, signer: createDataItemSigner(window.arweaveWallet) })
        json = await result({ message: sid, process: processId })
        setMsgId(sid)
        const entry = { id: crypto.randomUUID(), processId, request: msg, response: json, timestamp: new Date().toISOString(), sentMessageId: sid }
        const hist = dryRunHistoryStore.get() || []
        dryRunHistoryStore.set([...hist.slice(-9), entry])
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
