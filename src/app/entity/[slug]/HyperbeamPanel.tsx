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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
} from "@mui/material"
import React, { useState, memo, useRef } from "react"
import { useQueryClient } from '@tanstack/react-query'

import { useHyperbeamData } from "./useHyperbeamData"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { Subheading } from "@/components/Subheading"
import { TagChip } from "@/components/TagChip"

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

const HyperbeamPanel = memo(function HyperbeamPanel({ baseUrl, open }: HyperbeamPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalValue, setModalValue] = useState<{ key: string; value: any }>({ key: "", value: "" })
  const [customNodeInput, setCustomNodeInput] = useState("")
  const [customNodeUrl, setCustomNodeUrl] = useState<string | null>(null)
  const [customNodeError, setCustomNodeError] = useState<string | null>(null)
  const [usingCustom, setUsingCustom] = useState(false)

  // Debounce for custom node input
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Extract process path from baseUrl (everything after the domain)
  const processPath = (() => {
    try {
      const url = new URL(baseUrl)
      return url.pathname
    } catch {
      // fallback: find first single slash after protocol
      const match = baseUrl.match(/^https?:\/\/[^/]+(\/.*)$/)
      return match ? match[1] : ''
    }
  })()

  // Node options with process path appended
  const NODE_OPTIONS = [
    {
      label: "dev-router.forward.computer (Default)",
      value: `https://dev-router.forward.computer${processPath}`,
    },
    { label: "hb.zoao.dev", value: baseUrl },
    { label: "tee-4.forward.computer", value: `https://tee-4.forward.computer${processPath}` },
    { label: "Custom...", value: "__custom__" },
  ]

  // Key for localStorage
  const NODE_STORAGE_KEY = "hyperbeam_selected_node_url"
  const CUSTOM_NODE_STORAGE_KEY = "hyperbeam_custom_node_url"

  // Ensure selectedNodeUrl always matches one of the current NODE_OPTIONS
  const nodeOptionsValues = NODE_OPTIONS.map(opt => opt.value)
  const [selectedNodeUrl, setSelectedNodeUrl] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(NODE_STORAGE_KEY)
      if (saved && nodeOptionsValues.includes(saved)) return saved
    }
    return NODE_OPTIONS[0].value
  })

  // On mount, if saved value is invalid, clear it
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(NODE_STORAGE_KEY)
      if (saved && !nodeOptionsValues.includes(saved)) {
        localStorage.removeItem(NODE_STORAGE_KEY)
        setSelectedNodeUrl(NODE_OPTIONS[0].value)
      }
    }
    // eslint-disable-next-line
  }, [processPath, baseUrl])

  // Use custom hook for all data fetching and state
  const {
    atSlot,
    currentSlot,
    atSlotLoading,
    currentSlotLoading,
    loadingKeys,
    fetchError,
    nodeSwitching,
    setNodeSwitching,
    setFetchError,
    keys,
    values,
  } = useHyperbeamData({
    selectedNodeUrl,
    open,
    usingCustom,
    customNodeUrl,
    customNodeError,
    processPath,
  })

  const queryClient = useQueryClient();

  // On mount, restore custom node input if present
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCustom = localStorage.getItem(CUSTOM_NODE_STORAGE_KEY)
      if (savedCustom) {
        setCustomNodeInput(savedCustom)
        setCustomNodeUrl(savedCustom)
        setUsingCustom(true)
        setSelectedNodeUrl(savedCustom + processPath)
      }
    }
    // eslint-disable-next-line
  }, [])

  const handleOpenModal = (key: string, value: any) => {
    setModalValue({ key, value })
    setModalOpen(true)
  }
  const handleCloseModal = () => setModalOpen(false)

  // When the node changes, set nodeSwitching to true, clear keys/values, and reset error
  const handleNodeChange = (e: any) => {
    const value = e.target.value
    if (value === "__custom__") {
      setUsingCustom(true)
      setCustomNodeInput("")
      setCustomNodeUrl(null)
      setCustomNodeError(null)
      setSelectedNodeUrl("")
      setNodeSwitching(true)
      setFetchError(null)
      if (typeof window !== "undefined") {
        localStorage.setItem(NODE_STORAGE_KEY, "__custom__")
      }
      // Invalidate queries for new node
      queryClient.invalidateQueries({ queryKey: ['hyperbeam'] });
      queryClient.invalidateQueries({ queryKey: ['hyperbeam-atSlot'] });
      queryClient.invalidateQueries({ queryKey: ['hyperbeam-currentSlot'] });
      return
    }
    setUsingCustom(false)
    setSelectedNodeUrl(value)
    setNodeSwitching(true)
    setFetchError(null)
    if (typeof window !== "undefined") {
      localStorage.setItem(NODE_STORAGE_KEY, value)
    }
    // Invalidate queries for new node
    queryClient.invalidateQueries({ queryKey: ['hyperbeam'] });
    queryClient.invalidateQueries({ queryKey: ['hyperbeam-atSlot'] });
    queryClient.invalidateQueries({ queryKey: ['hyperbeam-currentSlot'] });
  }

  // Handle custom node input change (debounced)
  const handleCustomNodeInput = (e: any) => {
    const val = e.target.value
    setCustomNodeInput(val)
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(() => {
      // Basic validation
      if (!val.startsWith("http://") && !val.startsWith("https://")) {
        setCustomNodeError("URL must start with http:// or https://")
        setCustomNodeUrl(null)
        setSelectedNodeUrl("")
        return
      }
      setCustomNodeError(null)
      setCustomNodeUrl(val)
      setSelectedNodeUrl(val + processPath)
      setNodeSwitching(true)
      setFetchError(null)
      if (typeof window !== "undefined") {
        localStorage.setItem(CUSTOM_NODE_STORAGE_KEY, val)
        localStorage.setItem(NODE_STORAGE_KEY, "__custom__")
      }
      // Invalidate queries for new node
      queryClient.invalidateQueries({ queryKey: ['hyperbeam'] });
      queryClient.invalidateQueries({ queryKey: ['hyperbeam-atSlot'] });
      queryClient.invalidateQueries({ queryKey: ['hyperbeam-currentSlot'] });
    }, 300)
  }

  // After the useHyperbeamData hook and before the return statement:
  React.useEffect(() => {
    if (nodeSwitching && !loadingKeys) {
      setNodeSwitching(false);
    }
  }, [loadingKeys, nodeSwitching, setNodeSwitching]);

  // Determine user-friendly error message
  const allFieldsError = (
    (!atSlot && !atSlotLoading) &&
    (!currentSlot && !currentSlotLoading) &&
    (!keys || keys.length === 0) &&
    fetchError
  );
  const partialFieldsError = (
    ((atSlot && !atSlotLoading) || (currentSlot && !currentSlotLoading) || (keys && keys.length > 0)) &&
    fetchError
  );

  if (!open) return null

  return (
    <Paper sx={{ p: 3, maxHeight: 500, overflowY: "auto" }}>
      <Stack gap={2}>
        <Subheading type="HYPERBEAM" value="Hyperbeam Data" />
        {/* Node selection and display */}
        <FormControl
          size="small"
          sx={{ minWidth: 320, display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <InputLabel id="node-select-label">Node URL</InputLabel>
          <Select
            labelId="node-select-label"
            value={usingCustom ? "__custom__" : selectedNodeUrl}
            label="Node URL"
            onChange={handleNodeChange}
            sx={{ flex: 1, minWidth: 0, maxWidth: 350 }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxWidth: '90vw',
                  width: '100%',
                },
              },
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              disablePortal: true,
            }}
          >
            {NODE_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label} ({opt.value === "__custom__" ? "Enter your own" : opt.value})
              </MenuItem>
            ))}
          </Select>
          {nodeSwitching && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </FormControl>
        {usingCustom && (
          <Box sx={{ mt: 1, mb: 1 }}>
            <TextField
              label="Custom Node URL"
              value={customNodeInput}
              onChange={handleCustomNodeInput}
              size="small"
              fullWidth
              error={!!customNodeError}
              helperText={customNodeError || `Enter the base URL, e.g. https://my-node.com`}
            />
          </Box>
        )}
        <Typography variant="caption" color="text.secondary">
          Current node: {usingCustom && customNodeUrl ? `${customNodeUrl}${processPath}` : selectedNodeUrl}
        </Typography>

        {/* Display at-slot and current slot info */}
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">at-slot:</Typography>
          <Typography variant="body2">
            {atSlotLoading ? <CircularProgress size={12} /> : atSlot}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">slot/current:</Typography>
          <Typography variant="body2">
            {currentSlotLoading ? <CircularProgress size={12} /> : currentSlot}
          </Typography>
        </Stack>

        {loadingKeys || nodeSwitching ? (
          <CircularProgress size={24} />
        ) : allFieldsError ? (
          <SectionInfo title="Error" value="No available hyperbeam data." />
        ) : partialFieldsError ? (
          <SectionInfo title="Error" value="Please try a different node." />
        ) : !keys ? (
          <SectionInfo title="Availability" value="N/A" />
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
