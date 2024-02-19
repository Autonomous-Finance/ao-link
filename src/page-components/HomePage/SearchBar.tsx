"use client"

import { ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import React, { type ChangeEvent, useState } from "react"

import { getAoEventById, getAoEventsForOwner } from "@/services/aoscan"
import { normalizeAoEvent } from "@/utils/ao-event-utils"
import { TYPE_COLOR_MAP, TYPE_ICON_MAP } from "@/utils/data-utils"

type Result = {
  id: string
  type: "Message" | "Process" | "Block" | "Owner"
}

async function findByText(text: string): Promise<Result[]> {
  const [event, ownerEvents] = await Promise.all([
    getAoEventById(text),
    getAoEventsForOwner(text, 1),
  ])

  const results = []

  if (event) {
    results.push(normalizeAoEvent(event))
  }

  if (ownerEvents && ownerEvents.length > 0) {
    results.push({
      id: text,
      type: "Owner" as "Owner",
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
        <input
          role="button"
          placeholder="Search by Message ID / Process ID / Owner ID / Block Height"
          className="bg-background border border-[#222326] w-full py-[28px] px-[32px] outline-none focus:border-transparent z-50 relative"
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
              <li
                key={item.id}
                className="cursor-pointer p-[8px] bg-background flex justify-between"
              >
                <Link
                  href={`/${item.type.toLowerCase()}/${item.id}`}
                  className="w-full"
                >
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center gap-4">
                      <div
                        className={`gap-2 inline-flex px-2 py-1 ${
                          TYPE_COLOR_MAP[item.type]
                        }`}
                      >
                        <p className="uppercase">{item.type}</p>
                        {TYPE_ICON_MAP[item.type] && (
                          <Image
                            alt="icon"
                            width={8}
                            height={8}
                            src={TYPE_ICON_MAP[item.type]}
                          />
                        )}
                      </div>
                      <p>{item.id}</p>
                    </div>
                    <ArrowUpRight size={18} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isInputFocused && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-[#0000004d] z-[1]`}
        ></div>
      )}
    </div>
  )
}

export default SearchBar
