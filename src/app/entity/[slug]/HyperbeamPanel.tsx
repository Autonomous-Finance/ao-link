// src/app/entity/[slug]/HyperbeamPanel.tsx
import { Visibility } from "@mui/icons-material"
import {
  CircularProgress,
  Paper,
  Stack,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"
import { useStore } from "@nanostores/react"
import React, { useEffect, useState, memo } from "react"

import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"
import { TagChip } from "@/components/TagChip"
import { $hyperbeamData } from "@/stores/hyperbeamStore"

export type HyperbeamPanelProps = {
  baseUrl: string
  open: boolean
}

function shouldShowEyeIcon(value: any) {
  if (value == null) return false;
  if (typeof value === "object") {
    return Object.keys(value).length > 1;
  }
  return typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean";
}

const CACHE_TTL = 60 * 60 * 1000 // 1 hour

const HyperbeamPanel = memo(function HyperbeamPanel({ baseUrl, open }: HyperbeamPanelProps) {
  const hyperbeamData = useStore($hyperbeamData)
  const [loadingKeys, setLoadingKeys] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalValue, setModalValue] = useState<{ key: string; value: any }>({ key: "", value: "" })

  useEffect(() => {
    if (!open) return
    const now = Date.now()
    if (hyperbeamData.keys && hyperbeamData.values && now - hyperbeamData.lastFetched < CACHE_TTL) {
      console.log("[HyperbeamPanel] Using cached data")
      return
    }
    setLoadingKeys(true)
    const t0 = performance.now()
    console.log("[HyperbeamPanel] Fetching keys HEAD", new Date().toISOString())
    fetch(`${baseUrl}/compute/keys/serialize~json@1.0`, { method: "HEAD" })
      .then((r) => {
        const t1 = performance.now()
        console.log(`[HyperbeamPanel] HEAD request took ${(t1 - t0).toFixed(2)}ms`)
        return r.ok
          ? fetch(`${baseUrl}/compute/keys/serialize~json@1.0`).then((res) => res.json())
          : Promise.reject()
      })
      .then(async (data) => {
        const t2 = performance.now()
        const list = Array.isArray(data) ? data : Object.values(data)
        console.log(`[HyperbeamPanel] Got ${list.length} keys in ${(t2 - t0).toFixed(2)}ms`)
        if (!list.length) {
          $hyperbeamData.set({ keys: [], values: {}, lastFetched: now })
          return
        }
        const url = `${baseUrl}/compute/serialize~json@1.0?keys=${list.join(",")}`
        console.log("[HyperbeamPanel] Fetching all key values (batch)", url)
        const t3 = performance.now()
        const res = await fetch(url)
        const t4 = performance.now()
        let values = await res.json()
        const t5 = performance.now()
        if (Array.isArray(values)) {
          values = Object.fromEntries(list.map((k, i) => [k, values[i]]))
        }
        $hyperbeamData.set({ keys: list, values, lastFetched: now })
        console.log(
          `[HyperbeamPanel] Batch fetch took ${(t4 - t3).toFixed(2)}ms, JSON parse took ${(t5 - t4).toFixed(2)}ms`,
        )
        console.log("[HyperbeamPanel] Total time:", (t5 - t0).toFixed(2), "ms")
      })
      .catch((e) => {
        $hyperbeamData.set({ keys: null, values: {}, lastFetched: now })
        console.error("[HyperbeamPanel] Error fetching keys/values", e)
      })
      .finally(() => setLoadingKeys(false))
  }, [baseUrl, open, hyperbeamData])

  const handleOpenModal = (key: string, value: any) => {
    setModalValue({ key, value })
    setModalOpen(true)
  }
  const handleCloseModal = () => setModalOpen(false)

  if (!open) return null

  const keys = hyperbeamData.keys || []
  const values = hyperbeamData.values || {}

  return (
    <Paper sx={{ p: 3, maxHeight: 500, overflowY: "auto" }}>
      <Stack gap={2}>
        <Subheading type="HYPERBEAM" value="Hyperbeam Data" />

        {loadingKeys ? (
          <CircularProgress size={24} />
        ) : !hyperbeamData.keys ? (
          <SectionInfo title="Availability" value="Not available on Hyperbeam" />
        ) : (
          <>
            <SectionInfoWithChip title="Keys found" value={String(keys.length)} />
            {/* Display keys as tags */}
            <Stack gap={1} justifyContent="stretch">
              <Typography variant="subtitle2" color="text.secondary">
                Available Keys
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
                sx={{ maxHeight: 178, overflowY: "auto" }}
              >
                {keys.map((key) => {
                  const value = values[key]
                  if (value == null) {
                    return <TagChip key={key} name={key} value="(error)" copyOnlyValue />
                  }
                  const showEye = shouldShowEyeIcon(value);
                  const preview =
                    typeof value === "string"
                      ? value.slice(0, 30) + (value.length > 30 ? "..." : "")
                      : typeof value === "object"
                        ? "{...}"
                        : String(value);
                  return (
                    <span key={key} style={{ display: "flex", alignItems: "center" }}>
                      <TagChip name={key} value={preview} copyOnlyValue />
                      {showEye && (
                        <IconButton size="small" onClick={() => handleOpenModal(key, value)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      )}
                    </span>
                  );
                })}
              </Stack>
            </Stack>
            {/* Modal for big data */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
              <DialogTitle>{modalValue.key}</DialogTitle>
              <DialogContent>
                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                  {typeof modalValue.value === "string"
                    ? modalValue.value
                    : JSON.stringify(modalValue.value, null, 2)}
                </pre>
              </DialogContent>
            </Dialog>
          </>
        )}
      </Stack>
    </Paper>
  )
})

export { HyperbeamPanel }
