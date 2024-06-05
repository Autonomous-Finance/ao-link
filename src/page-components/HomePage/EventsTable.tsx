"use client"
import { CircularProgress, MenuItem, Select, Stack, Typography } from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

import { MonoFontFF } from "@/components/RootLayout/fonts"
import { TypeBadge } from "@/components/TypeBadge"
import { useUpdateSearch } from "@/hooks/useUpdateSearch"
import {
  type AoEvent,
  subscribeToEvents,
  getLatestAoEvents,
  targetEmptyValue,
} from "@/services/aoscan"
import { FilterOption } from "@/types"
import { type AoMessage, normalizeAoEvent } from "@/utils/ao-event-utils"

import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"

import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

import { IdBlock } from "../../components/IdBlock"

type EventTablesProps = {
  initialData: AoMessage[]
  blockHeight?: number
  ownerId?: string
  pageSize: number
}

const EventsTable = (props: EventTablesProps) => {
  const { initialData, blockHeight, pageSize, ownerId } = props

  const searchParams = useSearchParams()
  const loaderRef = useRef(null)

  const listSizeRef = useRef(pageSize)

  const [endReached, setEndReached] = useState(false)

  const filterRef = useRef<FilterOption>((searchParams?.get("filter") as FilterOption) || "")

  useEffect(() => {
    if (endReached) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log("Intersecting - Fetching more data")
          getLatestAoEvents(
            pageSize,
            listSizeRef.current,
            filterRef.current,
            blockHeight,
            ownerId,
          ).then((events) => {
            console.log(`Fetched another page of ${events.length} records`)
            if (events.length === 0) {
              console.log("No more records to fetch")
              observer.disconnect()
              setEndReached(true)
              return
            }

            setData((prevData) => {
              const newData = events.map(normalizeAoEvent)
              const newList = [...prevData, ...newData]
              listSizeRef.current = newList.length
              return newList
            })
          })
        } else {
          console.log("Not intersecting")
        }
      },
      { threshold: 1 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const [data, setData] = useState<AoMessage[]>(initialData)
  const [streamingPaused, setStreamingPaused] = useState(false)
  const [realtime, setRealtime] = useState(false)

  useEffect(() => {
    if (!realtime) return

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        console.log("Resuming realtime streaming")
        getLatestAoEvents(listSizeRef.current, 0, filterRef.current, blockHeight, ownerId).then(
          (events) => {
            console.log(`Fetched ${events.length} records, listSize=${listSizeRef.current}`)
            setData(events.map(normalizeAoEvent))
            setStreamingPaused(false)
          },
        )
      } else {
        console.log("Pausing realtime streaming")
        setStreamingPaused(true)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return function cleanup() {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtime])

  useEffect(() => {
    if (streamingPaused) return
    if (!realtime) return

    const unsubscribe = subscribeToEvents((event: AoEvent) => {
      if (blockHeight && event.height !== blockHeight) return
      if (ownerId && event.owner_address !== ownerId) return
      if (filterRef.current === "message" && event.target === targetEmptyValue) {
        return
      }
      if (filterRef.current === "process" && event.target !== targetEmptyValue) {
        return
      }

      console.log("New realtime event", event.id)
      setData((prevData) => {
        const parsed = normalizeAoEvent(event)
        listSizeRef.current = prevData.length + 1
        return [parsed, ...prevData]
      })
    })
    console.log("Subscribed to realtime updates")

    return function cleanup() {
      console.log("Unsubscribed from realtime updates")
      unsubscribe()
    }
  }, [streamingPaused, blockHeight, pageSize, ownerId, realtime])

  const router = useRouter()
  const updateSearch = useUpdateSearch()

  return (
    <Stack marginTop={5} gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle1" sx={{ textTransform: "uppercase" }}>
          Latest events
        </Typography>
        <Stack direction="row" gap={2} alignItems="center">
          {/* <FormControlLabel
            sx={{ marginY: 0.5 }}
            slotProps={{ typography: { variant: "body2" } }}
            onChange={() => {
              setRealtime(!realtime)
              localStorage.setItem("realtime", String(!realtime))
            }}
            control={
              <AntSwitch
                sx={{ m: 1 }}
                checked={realtime}
                color={realtime ? "info" : "error"}
              />
            }
            labelPlacement="start"
            label="Live data"
          /> */}
          <Select
            size="small"
            sx={{
              height: "fit-content",
              width: 160,
              lineHeight: "normal",
              "& .MuiSelect-select": { paddingY: "4px !important" },
            }}
            displayEmpty
            value={filterRef.current}
            onChange={(event) => {
              const newValue = event.target.value as FilterOption
              filterRef.current = newValue
              updateSearch("filter", newValue)
              getLatestAoEvents(listSizeRef.current, 0, newValue, blockHeight, ownerId).then(
                (events) => {
                  console.log(
                    `Fetched ${events.length} records, listSize=${listSizeRef.current} (filter changed)`,
                  )
                  setData(events.map(normalizeAoEvent))
                },
              )
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="message">Messages</MenuItem>
            <MenuItem value="process">Processes</MenuItem>
          </Select>
        </Stack>
      </Stack>
      {data.length ? (
        <div>
          <table className="min-w-full">
            <thead className="table-headers">
              <tr>
                <th className="text-start p-2 w-[120px]">Type</th>
                <th className="text-start p-2">Action</th>
                <th className="text-start p-2 w-[220px]">ID</th>
                <th className="text-start p-2 w-[220px]">From</th>
                <th className="text-start p-2 w-[220px]">To</th>
                {!blockHeight && <th className="text-end p-2 w-[160px]">Block Height</th>}
                <th className="text-end p-2 w-[160px]">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  className="table-row cursor-pointer"
                  key={item.id}
                  onClick={() => {
                    router.push(`/${TYPE_PATH_MAP[item.type]}/${item.id}`)
                  }}
                >
                  <td className="text-start p-2">
                    <TypeBadge type={item.type} />
                  </td>
                  <td className="text-start p-2 ">{item.action}</td>
                  <td className="text-start p-2 ">
                    <IdBlock
                      label={truncateId(item.id)}
                      value={item.id}
                      href={`/${TYPE_PATH_MAP[item.type]}/${item.id}`}
                    />
                  </td>
                  <td className="text-start p-2">
                    <IdBlock
                      label={truncateId(item.from)}
                      value={item.from}
                      href={`/entity/${item.from}`}
                    />
                  </td>
                  <td className="text-start p-2 ">
                    {item.to && (
                      <IdBlock
                        label={truncateId(item.to)}
                        value={item.to}
                        href={`/entity/${item.to}`}
                      />
                    )}
                  </td>
                  {!blockHeight && (
                    <td className="text-end p-2">
                      <Typography fontFamily={MonoFontFF} component="div" variant="inherit">
                        <IdBlock
                          label={formatNumber(item.blockHeight || 0)}
                          value={String(item.blockHeight)}
                          href={`/block/${item.blockHeight}`}
                        />
                      </Typography>
                    </td>
                  )}
                  <td className="text-end p-2">
                    <span className="tooltip" data-tip={formatFullDate(item.created)}>
                      {formatRelative(item.created)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Stack
            marginY={2}
            marginX={1}
            ref={loaderRef}
            sx={{ width: "100%" }}
            direction="row"
            gap={1}
            alignItems="center"
            // justifyContent="center"
          >
            {!endReached && <CircularProgress size={12} color="primary" />}
            <Typography variant="body2" color="text.secondary">
              {endReached ? `Total rows: ${data.length}` : "Loading more records..."}
            </Typography>
          </Stack>
        </div>
      ) : null}
    </Stack>
  )
}

export default EventsTable
