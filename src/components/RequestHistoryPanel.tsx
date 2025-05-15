import React, { useEffect, useState } from "react"
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
import { CodeEditor } from "@/components/CodeEditor"
import { useActiveAddress } from "@arweave-wallet-kit/react"

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

export function RequestHistoryPanel({ onSelect }: RequestHistoryPanelProps) {
  const address = useActiveAddress()
  const [history, setHistory] = useState<any[]>([])
  const [expanded, setExpanded] = useState<string | false>(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const loadHistory = () => {
    const raw = localStorage.getItem("dryRunHistory") || "[]"
    try {
      const data = JSON.parse(raw)
      setHistory(Array.isArray(data) ? data.slice().reverse() : [])
    } catch {
      setHistory([])
    }
  }

  useEffect(() => {
    loadHistory()
    window.addEventListener("storage", loadHistory)
    const handle = setInterval(loadHistory, 5000)
    return () => {
      window.removeEventListener("storage", loadHistory)
      clearInterval(handle)
    }
  }, [])

  const clearHistory = () => {
    localStorage.removeItem("dryRunHistory")
    setHistory([])
  }

  const handleChange = (id: string) => (_: any, isExpanded: boolean) =>
    setExpanded(isExpanded ? id : false)

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
        const name = resTags.Name || resTags.Ticker || "-"
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

  if (!address) {
    return null
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

      {history.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No history yet.
        </Typography>
      ) : (
        history.map((item) => {
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
                      <CodeEditor
                        height="100%"
                        defaultLanguage="json"
                        defaultValue={JSON.stringify(item.request, null, 2)}
                        options={{ readOnly: true }}
                      />
                    </Paper>
                  </Grid2>
                  <Grid2 xs={12} md={6} sx={{ height: "100%" }}>
                    <Typography variant="caption" gutterBottom>
                      Result
                    </Typography>
                    <Paper sx={{ height: "100%", overflow: "auto" }}>
                      <CodeEditor
                        height="100%"
                        defaultLanguage="json"
                        defaultValue={JSON.stringify(item.response, null, 2)}
                        options={{ readOnly: true }}
                      />
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