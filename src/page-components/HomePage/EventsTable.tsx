"use client"
import { MenuItem, Select, Stack, Typography } from "@mui/material"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

import { MonoFontFF } from "@/components/RootLayout/fonts"
import { useUpdateSearch } from "@/hooks/useUpdateSearch"
import {
  type AoEvent,
  subscribeToEvents,
  getLatestAoEvents,
  targetEmptyValue,
} from "@/services/aoscan"
import { FilterOption } from "@/types"
import {
  type NormalizedAoEvent,
  normalizeAoEvent,
} from "@/utils/ao-event-utils"

import { TYPE_COLOR_MAP, TYPE_ICON_MAP, truncateId } from "@/utils/data-utils"

import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

import { IdBlock } from "../../components/IdBlock"

type EventTablesProps = {
  initialData: NormalizedAoEvent[]
  blockHeight?: number
  ownerId?: string
  pageLimit?: number
}

const EventsTable = (props: EventTablesProps) => {
  const { initialData, blockHeight, pageLimit, ownerId } = props

  const searchParams = useSearchParams()

  const [filter, setFilter] = useState<FilterOption>(
    (searchParams?.get("filter") as FilterOption) || "",
  )

  const [data, setData] = useState<NormalizedAoEvent[]>(initialData)

  const [pauseStreaming, setPauseStreaming] = useState(false)

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        console.log("Resuming realtime streaming")
        setPauseStreaming(false)
      } else {
        console.log("Pausing realtime streaming")
        setPauseStreaming(true)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return function cleanup() {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (pauseStreaming) return
    console.log("Fetching latest data")
    getLatestAoEvents(pageLimit, filter).then((events) => {
      setData(events.map(normalizeAoEvent))
    })
  }, [pauseStreaming, pageLimit, filter])

  useEffect(() => {
    if (pauseStreaming) return

    const unsubscribe = subscribeToEvents((event: AoEvent) => {
      if (blockHeight && event.height !== blockHeight) return
      if (ownerId && event.owner_address !== ownerId) return
      if (filter === "message" && event.target === targetEmptyValue) {
        return
      }
      if (filter === "process" && event.target !== targetEmptyValue) {
        return
      }

      console.log("📜 LOG > subscribe > event:", event)
      setData((prevData) => {
        const parsed = normalizeAoEvent(event)

        if (pageLimit === undefined) {
          return [parsed, ...prevData]
        }

        return [parsed, ...prevData.slice(0, pageLimit - 1)]
      })
    })

    return unsubscribe
  }, [pauseStreaming, blockHeight, pageLimit, ownerId, filter])

  const router = useRouter()
  const updateSearch = useUpdateSearch()

  return (
    <Stack marginTop={5} gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <div className="text-main-dark-color uppercase ">Latest events</div>
        <Select
          size="small"
          sx={{
            width: 160,
            lineHeight: "normal",
            "& .MuiSelect-select": { paddingY: "4px !important" },
          }}
          displayEmpty
          value={filter}
          onChange={(event) => {
            const newValue = event.target.value as FilterOption
            setFilter(newValue)
            updateSearch("filter", newValue)
          }}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="message">Messages</MenuItem>
          <MenuItem value="process">Processes</MenuItem>
        </Select>
      </Stack>
      {data.length ? (
        <div>
          <table className="min-w-full">
            <thead className="table-headers">
              <tr>
                <th className="text-start p-2 w-[120px]">Type</th>
                <th className="text-start p-2">Action</th>
                <th className="text-start p-2 w-[220px]">Message ID</th>
                <th className="text-start p-2 w-[220px]">Process ID</th>
                {!ownerId && (
                  <th className="text-start p-2 w-[220px]">Owner</th>
                )}
                {!blockHeight && (
                  <th className="text-end p-2 w-[160px]">Block Height</th>
                )}
                <th className="text-end p-2 w-[160px]">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  className="table-row cursor-pointer"
                  key={item.id}
                  onClick={() => {
                    router.push(
                      item.type === "Message"
                        ? `/message/${item.id}`
                        : `/process/${item.id}`,
                    )
                  }}
                >
                  <td className="text-start p-2">
                    <div
                      className={`gap-2 inline-flex px-2 py-1 ${
                        TYPE_COLOR_MAP[item.type]
                      }`}
                    >
                      <p className="uppercase">{item.type}</p>
                      <Image
                        alt="icon"
                        width={8}
                        height={8}
                        src={TYPE_ICON_MAP[item.type]}
                      />
                    </div>
                  </td>
                  <td className="text-start p-2 ">{item.action}</td>
                  <td className="text-start p-2 ">
                    <IdBlock
                      label={truncateId(item.messageId)}
                      value={item.messageId}
                      href={`/message/${item.messageId}`}
                    />
                  </td>
                  <td className="text-start p-2">
                    <IdBlock
                      label={truncateId(item.processId)}
                      value={item.processId}
                      href={`/process/${item.processId}`}
                    />
                  </td>
                  {!ownerId && (
                    <td className="text-start p-2 ">
                      <IdBlock
                        label={truncateId(item.owner)}
                        value={item.owner}
                        href={`/owner/${item.owner}`}
                      />
                    </td>
                  )}
                  {!blockHeight && (
                    <td className="text-end p-2">
                      <Typography
                        fontFamily={MonoFontFF}
                        component="div"
                        variant="inherit"
                      >
                        <IdBlock
                          label={formatNumber(item.blockHeight)}
                          value={String(item.blockHeight)}
                          href={`/block/${item.blockHeight}`}
                        />
                      </Typography>
                    </td>
                  )}
                  <td className="text-end p-2">
                    <span
                      className="tooltip"
                      data-tip={formatFullDate(item.created)}
                    >
                      {formatRelative(item.created)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Stack>
  )
}

export default EventsTable
