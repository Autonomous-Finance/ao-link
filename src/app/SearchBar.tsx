"use client"

import { Backdrop, Box, CircularProgress, InputAdornment, TextField } from "@mui/material"
import { ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react"
import React, { type ChangeEvent, useState } from "react"

import { Link } from "react-router-dom"

import { TypeBadge } from "@/components/TypeBadge"
import { getMessageById } from "@/services/messages-api"
import { getTokenInfo } from "@/services/token-api"
import { TYPE_PATH_MAP } from "@/utils/data-utils"

type ResultType = "Message" | "Entity" | "Block" | "Checkpoint" | "Assignment" | "Process" | "Token"

type Result = {
  id: string
  type: ResultType
}

async function findByText(text: string): Promise<Result[]> {
  if (!text || !text.trim()) return Promise.resolve([])

  const [msg, tokenInfo] = await Promise.all([getMessageById(text), getTokenInfo(text)])

  const results = []

  if (msg) {
    results.push({
      id: msg.id,
      type: msg.type,
    })
  }

  if (tokenInfo) {
    results.push({
      id: text,
      type: "Token" as ResultType,
    })
  }

  if (!msg) {
    results.push({
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

  return (
    <Box sx={{ width: 640 }}>
      <div className="dropdown relative w-full">
        <TextField
          size="small"
          sx={{
            background: "var(--mui-palette-background-default) !important",
            "& fieldset": {
              borderColor: "var(--mui-palette-divider) !important",
            },
            width: "100%",
            zIndex: 50,
          }}
          placeholder="Search by Message ID / Process ID / User ID / Block Height"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          InputProps={{
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
        <div tabIndex={0} className="dropdown-content z-50 w-full">
          <ul className="z-50 relative max-h-[200px] overflow-y-auto">
            {results.map((item) => (
              <Box
                component={"li"}
                sx={{
                  background: "var(--mui-palette-background-default)",
                  color: "text.primary",
                }}
                key={`${item.id}_${item.type}`}
                className="cursor-pointer p-[8px] flex justify-between"
                onClick={() => {
                  setInputValue("")
                  setResults([])
                }}
              >
                <Link to={`/${TYPE_PATH_MAP[item.type]}/${item.id}`} className="w-full">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center gap-4">
                      <TypeBadge type={item.type} />
                      <p>{item.id}</p>
                    </div>
                    <ArrowUpRight size={18} />
                  </div>
                </Link>
              </Box>
            ))}
          </ul>
        </div>
      </div>
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
