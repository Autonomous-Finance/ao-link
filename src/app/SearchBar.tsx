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
import React, { type ChangeEvent, useState } from "react"

import { useNavigate } from "react-router-dom"

import { TypeBadge } from "@/components/TypeBadge"
import { getMessageById } from "@/services/messages-api"
import { getTokenInfo } from "@/services/token-api"
import { TYPE_PATH_MAP } from "@/utils/data-utils"
import { isArweaveId } from "@/utils/utils"

type ResultType = "Message" | "Entity" | "Block" | "Checkpoint" | "Assignment" | "Process" | "Token"

type Result = {
  label: string
  id: string
  type: ResultType
}

async function findByText(text: string): Promise<Result[]> {
  if (!text || !text.trim()) return Promise.resolve([])

  const [msg, tokenInfo] = await Promise.all([
    getMessageById(text),
    getTokenInfo(text).catch(() => {
      console.log("Token not found")
    }),
  ])

  const results = []

  if (msg && msg.type) {
    results.push({
      label: text,
      id: msg.id,
      type: msg.type,
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

  return results
}

const SearchBar = () => {
  const [isInputFocused, setIsInputFocused] = useState(false)

  const [inputValue, setInputValue] = useState("")

  const [results, setResults] = useState<Result[]>([])

  const [loading, setLoading] = useState(false)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setInputValue(value)

    const numericString = /^\d+$/
    if (numericString.test(value)) {
      setResults([
        {
          label: value,
          id: value,
          type: "Block",
        },
      ])
      return
    }

    setLoading(true)
    findByText(value)
      .then(setResults)
      .finally(() => {
        setLoading(false)
      })
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
    <Box sx={{ width: 640 }}>
      <Autocomplete
        id="search-bar"
        size="small"
        disableClearable
        clearOnEscape
        freeSolo
        options={results}
        value={inputValue}
        onChange={(event, newValue, reason) => {
          if (reason === "selectOption" && typeof newValue !== "string") {
            setInputValue("")
            setResults([])
            navigate(`/${TYPE_PATH_MAP[newValue.type]}/${newValue.id}`)
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
            placeholder="Search by Message ID / Process ID / User ID / Block Height"
            sx={{
              background: "var(--mui-palette-background-default) !important",
              "& fieldset": {
                borderColor: "var(--mui-palette-divider) !important",
              },
              width: "100%",
              zIndex: 50,
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
          'html[data-mui-color-scheme="dark"] &': {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          },
        }}
      />
    </Box>
  )
}

export default SearchBar
