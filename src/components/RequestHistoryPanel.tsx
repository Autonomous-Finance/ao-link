import React, { useState, lazy, Suspense } from "react"
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { persistentAtom } from "@nanostores/persistent"
import { useStore } from "@nanostores/react"

export const dryRunHistoryStore = persistentAtom<any[]>(
  "dryRunHistory",
  [],
  { encode: JSON.stringify, decode: JSON.parse },
)

const MAX_HISTORY = 5;

export function addToDryRunHistory(newItem: any) {
  const prev = dryRunHistoryStore.get() || [];
  const updated = [...prev, newItem];
  if (updated.length > MAX_HISTORY) {
    updated.splice(0, updated.length - MAX_HISTORY); // Remove oldest
  }
  dryRunHistoryStore.set(updated);
}

const ChevronDownIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M15.25 10.75L12 14.25L8.75 10.75"
    />
  </svg>
)

const truncateMiddle = (str: string, front = 8, back = 8) => {
  if (!str || str.length <= front + back) return str
  return `${str.slice(0, front)}...${str.slice(-back)}`
}

interface RequestHistoryPanelProps {
  onSelect: (payload: string) => void
}

const CodeEditor = lazy(() => import("./CodeEditor").then(m=>({default:m.CodeEditor})))

export function RequestHistoryPanel({ onSelect }: RequestHistoryPanelProps) {
  const address = useActiveAddress()
  const rawHistory = useStore(dryRunHistoryStore)
  const history = Array.isArray(rawHistory) ? rawHistory : []
  const [expanded, setExpanded] = useState<string | false>(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  if (!address) {
    return null
  }

  const clearHistory = () => {
    dryRunHistoryStore.set([])
  }

  const handleChange = (id: string) => (_: any, isExpanded: boolean) =>
    setExpanded(isExpanded ? id : false)

  const displayed = history
    .slice()
    .reverse()
    .slice(0, 10)

  const renderSummary = (item: any) => {
    const reqTags = (item.request.tags || []).reduce((acc: any, t: any) => {
      acc[t.name] = t.value
      return acc
    }, {})

    const firstMsg = item.response?.Messages?.[0] || {}
    const resTags = Array.isArray(firstMsg.Tags)
      ? firstMsg.Tags.reduce((acc: any, t: any) => {
          acc[t.name] = t.value
          return acc
        }, {})
      : {}

    if (resTags["Delegation-Oracle"]) {
      return (
        <Typography variant="body2" fontWeight={500}>
          Delegation Oracle → {resTags["Delegation-Oracle"]}
        </Typography>
      );
    }
    // special Info-Response case
    if (resTags.Action === "Info-Response") {
      return (
        <Typography variant="body2" fontWeight={500}>
          Info - Portfolio Agent
        </Typography>
      )
    }

    // Transfer
    if (reqTags.Action === "Transfer") {
      const recipient = reqTags.Recipient || "-"
      const qty = reqTags.Quantity || "-"
      return (
        <>
          <Typography variant="body2" fontWeight={500}>
            Transfer → {truncateMiddle(recipient)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Quantity: {qty}
          </Typography>
        </>
      )
    }

    // Balance / Info fallback
    switch (reqTags.Action) {
      case "Balance": {
        const recipient = reqTags.Recipient || resTags.Account || "-"
        const token = resTags.Ticker || ""
        const balance = resTags.Balance ?? firstMsg.Data ?? "-"
        return (
          <>
            <Typography variant="body2" fontWeight={500}>
              {token} Balance → {truncateMiddle(recipient)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Balance: {balance}
            </Typography>
          </>
        )
      }
      case "Info": {
        // extract Agent-Type if present
        let agentType: string | undefined
        const rawData = firstMsg.Data
        if (rawData && typeof rawData === "object") {
          agentType = (rawData as Record<string, any>)["Agent-Type"]
        } else if (typeof rawData === "string") {
          try {
            agentType = JSON.parse(rawData)["Agent-Type"]
          } catch {
          }
        }
        agentType = agentType ?? resTags["Agent-Type"]
        const name = agentType ?? resTags.Name ?? resTags.Ticker ?? "-"
        return (
          <Typography variant="body2" fontWeight={500}>
            Info → {name}
          </Typography>
        )
      }
      default:
        return (
          <>
            <Typography variant="body2" fontWeight={500}>
              {reqTags.Action}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              No parsed data available
            </Typography>
          </>
        )
    }
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">History</Typography>
        <Button size="small" color="error" onClick={clearHistory}>
          CLEAR
        </Button>
      </Stack>
      <Divider sx={{ my: 1 }} />

      {displayed.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No history yet.
        </Typography>
      ) : (
        displayed.map((item) => {
          const dimmed = hoveredId !== null && hoveredId !== item.id
          return (
            <Accordion
              key={item.id}
              expanded={expanded === item.id}
              onChange={handleChange(item.id)}
              disableGutters
              elevation={0}
              sx={{ mb: 1, opacity: dimmed ? 0.3 : 1, transition: "opacity 0.2s" }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <AccordionSummary expandIcon={<ChevronDownIcon />}>
                <Stack spacing={0.5} sx={{ width: "100%" }}>
                  {renderSummary(item)}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.timestamp).toLocaleString()}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ height: 400 }}>
                <Grid2 container spacing={2} sx={{ height: "100%" }}>
                  <Grid2 xs={12} md={6} sx={{ height: "100%" }}>
                    <Typography variant="caption" gutterBottom>
                      Query
                    </Typography>
                    <Paper sx={{ height: "100%", overflow: "auto" }}>
                      <Suspense fallback={<div style={{height:200,display:'flex',justifyContent:'center',alignItems:'center'}}>Loading editor...</div>}>
                        <CodeEditor
                          height="100%"
                          defaultLanguage="json"
                          defaultValue={JSON.stringify(item.request, null, 2)}
                          options={{ readOnly: true }}
                        />
                      </Suspense>
                    </Paper>
                  </Grid2>
                  <Grid2 xs={12} md={6} sx={{ height: "100%" }}>
                    <Typography variant="caption" gutterBottom>
                      Result
                    </Typography>
                    <Paper sx={{ height: "100%", overflow: "auto" }}>
                      <Suspense fallback={<div style={{height:200,display:'flex',justifyContent:'center',alignItems:'center'}}>Loading editor...</div>}>
                        <CodeEditor
                          height="100%"
                          defaultLanguage="json"
                          defaultValue={JSON.stringify(item.response, null, 2)}
                          options={{ readOnly: true }}
                        />
                      </Suspense>
                    </Paper>
                  </Grid2>
                </Grid2>
              </AccordionDetails>
            </Accordion>
          )
        })
      )}
    </Paper>
  )
}