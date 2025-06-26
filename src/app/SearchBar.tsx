"use client"

import {
  Autocomplete,
  Backdrop,
  Box,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react"
import React, { type ChangeEvent, useState, useCallback, useRef } from "react"

import { useNavigate } from "react-router-dom"

import { TypeBadge } from "@/components/TypeBadge"
import { resolveArNSName } from "@/services/arns-service"
import { getMessageById } from "@/services/messages-api"
import { getTokenInfo } from "@/services/token-api"
import { TYPE_PATH_MAP } from "@/utils/data-utils"
import { isArweaveId } from "@/utils/utils"

type ResultType =
  | "Message"
  | "Entity"
  | "Block"
  | "Checkpoint"
  | "Assignment"
  | "Process"
  | "Token"
  | "Swap"
  | "ArNS"
  | "User"

type Result = {
  label: string
  id: string
  type: ResultType
}

async function findByText(text: string, abortSignal?: AbortSignal): Promise<Result[]> {
  if (!text || !text.trim()) return Promise.resolve([])
  text = text.trim()

  // Check if request was cancelled
  if (abortSignal?.aborted) {
    throw new Error('Search cancelled')
  }

  // Determine what searches to perform based on input pattern
  const isLikelyArweaveId = isArweaveId(text) || text.length === 43
  
  const [msg, tokenInfo, arnsResolution] = await Promise.all([
    getMessageById(text).catch((err) => {
      console.log("Message not found", text, err)
      return null
    }),
    getTokenInfo(text).catch((err) => {
      console.log("Token not found", text, err)
      return null
    }),
    // Only search ArNS if the input doesn't look like an Arweave ID
    !isLikelyArweaveId ? resolveArNSName(text).catch((err) => {
      console.log("ArNS not found", text, err)
      return null
    }) : Promise.resolve(null)
  ])

  const results = []

  if (msg && msg.type) {
    results.push({
      label: text,
      id: msg.id,
      type: msg.type,
    })
  }

  if (msg && msg.action === "Transfer") {
    results.push({
      label: text,
      id: msg.id,
      type: "Swap" as const,
    })
  }

  if (tokenInfo) {
    results.push({
      label: text,
      id: text,
      type: "Token" as ResultType,
    })
  }

  if (!msg && isArweaveId(text)) {
    results.push({
      label: text,
      id: text,
      type: "Entity" as ResultType,
    })
  }

  if (arnsResolution) {
    // 1. ArNS management result - links to arns.ar.io
    results.push({
      label: `${text} (ArNS Management)`,
      id: text,
      type: "ArNS" as ResultType,
    })
    
    // 2. User result - the owner of the ArNS name
    if (arnsResolution.owner && !results.some(r => r.id === arnsResolution.owner)) {
      results.push({
        label: `${arnsResolution.owner} (ArNS Owner)`,
        id: arnsResolution.owner,
        type: "User" as ResultType,
      })
    }
    
    // 3. Process result - the ANT process that manages this name
    if (arnsResolution.processId && !results.some(r => r.id === arnsResolution.processId)) {
      results.push({
        label: `${arnsResolution.processId} (ANT Process)`,
        id: arnsResolution.processId,
        type: "Process" as ResultType,
      })
    }
  }

  return results
}

const SearchBar = () => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  const abortControllerRef = useRef<AbortController>()

  const performSearch = useCallback(async (value: string) => {
    if (!value.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    const numericString = /^\d+$/
    if (numericString.test(value)) {
      setResults([
        {
          label: value,
          id: value,
          type: "Block",
        },
      ])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const searchResults = await findByText(value, abortControllerRef.current.signal)
      setResults(searchResults)
    } catch (error: any) {
      if (error.message !== 'Search cancelled') {
        console.error('Search error:', error)
        setResults([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setInputValue(value)

    // Clear previous debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Debounce search requests
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(value)
    }, 300) // 300ms debounce
  }

  const handleInputFocus = () => {
    setIsInputFocused(true)
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false)
    }, 0)
  }

  const navigate = useNavigate()

  return (
    <Box sx={{ width: { xs: "100%", sm: 640 }, position: "relative" }}>
      <Autocomplete
        id="search-bar"
        size="small"
        disableClearable
        clearOnEscape
        freeSolo
        options={results}
        value={inputValue}
        sx={{
          "& .MuiAutocomplete-listbox": {
            maxHeight: "400px",
          },
          "& .MuiAutocomplete-popper": {
            zIndex: 1301, // Higher than backdrop
            width: { xs: "100vw !important", sm: "auto" },
            maxWidth: { xs: "100vw", sm: "none" },
            left: { xs: "0 !important", sm: "auto" },
          },
        }}
        onChange={(event, newValue, reason) => {
          if (reason === "selectOption" && typeof newValue !== "string") {
            setInputValue("")
            setResults([])
            
            // Special handling for ArNS management
            if (newValue.type === "ArNS") {
              window.open(`https://arns.ar.io/#/manage/names/${newValue.id}`, '_blank')
            } else {
              navigate(`/${TYPE_PATH_MAP[newValue.type]}/${newValue.id}`)
            }
            
            document.getElementById("search-bar")?.blur()
          }

          if (reason === "clear") {
            document.getElementById("search-bar")?.blur()
          }
        }}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        renderOption={(props, option) => (
          <Stack
            {...props}
            direction="row"
            alignItems="center"
            component={MenuItem}
            key={`${option.id}_${option.type}`}
            justifyContent="space-between"
          >
            <Stack direction="row" gap={1} alignItems="center">
              <TypeBadge type={option.type} />
              <Typography variant="inherit">{option.id}</Typography>
            </Stack>
            <ArrowUpRight size={18} />
          </Stack>
        )}
        filterOptions={(x) => x}
        renderInput={(params) => (
          <TextField
            placeholder="Search by Message ID / Process ID / User ID / Block Height / ArNS name"
            sx={{
              background: "var(--mui-palette-background-default) !important",
              "& fieldset": {
                borderColor: "var(--mui-palette-divider) !important",
              },
              width: "100%",
              zIndex: 50,
              "& .MuiOutlinedInput-root": {
                overflow: "hidden",
              },
            }}
            {...params}
            onChange={handleInputChange}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <MagnifyingGlass width={16} height={16} alt="search" />
                  )}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <Backdrop
        open={isInputFocused}
        sx={{
          zIndex: 10,
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          'html[data-mui-color-scheme="dark"] &': {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        }}
      />
    </Box>
  )
}

export default SearchBar
