"use client"

import { Backdrop, Box } from "@mui/material"
import { ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react"
import Link from "next/link"
import React, { type ChangeEvent, useState } from "react"

import { TypeBadge } from "@/components/TypeBadge"
import { getAoEventById, getLatestAoEvents } from "@/services/aoscan"
import { normalizeAoEvent } from "@/utils/ao-event-utils"

type ResultType = "Message" | "Entity" | "Block"

type Result = {
  id: string
  type: ResultType
}

async function findByText(text: string): Promise<Result[]> {
  if (!text || !text.trim()) return Promise.resolve([])

  const [event, ownerEvents] = await Promise.all([
    getAoEventById(text),
    getLatestAoEvents(1, 0, undefined, undefined, text),
  ])

  const results = []

  if (event) {
    results.push({
      id: event.id,
      type:
        normalizeAoEvent(event).type === "Message"
          ? "Message"
          : ("Entity" as ResultType),
    })
  }

  if (ownerEvents && ownerEvents.length > 0) {
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

  //
  // const handleKeyDown = (e: any) => {
  //   if (e.code === "Enter") {
  //     push(`/${inputValue}`)
  //   }
  // }

  return (
    <div>
      <div className="dropdown relative w-full">
        <Box
          component="input"
          sx={{
            background: "var(--mui-palette-background-default) !important",
            border: "1px solid var(--mui-palette-text-primary) !important",
            "&:focus": {
              borderColor: "var(--mui-palette-background-default) !important",
            },
          }}
          role="button"
          placeholder="Search by Message ID / Process ID / User ID / Block Height"
          className="bg-transparent w-full py-[28px] px-[32px] outline-none focus:border-transparent z-50 relative"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {loading ? (
          <div className="absolute right-[32px] top-1/2 -translate-y-1/2 text-[18px] z-[51]">
            <div className="w-[24px] h-[24px] border-l-2 border-main-dark-color rounded-full animate-spin"></div>
          </div>
        ) : (
          <MagnifyingGlass
            width={28}
            height={28}
            alt="search"
            className="absolute right-[32px] top-1/2 -translate-y-1/2 text-[18px] z-[51]"
          />
        )}
        <div tabIndex={0} className="dropdown-content z-50 w-full">
          <ul className="mt-[10px] z-50 relative max-h-[200px] overflow-y-auto">
            {results.map((item) => (
              <Box
                component={"li"}
                sx={{ background: "var(--mui-palette-background-default)" }}
                key={item.id}
                className="cursor-pointer p-[8px] flex justify-between"
              >
                <Link
                  href={`/${item.type.toLowerCase()}/${item.id}`}
                  className="w-full"
                >
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
    </div>
  )
}

export default SearchBar
