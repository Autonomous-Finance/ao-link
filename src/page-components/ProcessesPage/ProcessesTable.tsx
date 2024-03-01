"use client"
import { CircularProgress, Stack, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

import { MonoFontFF } from "@/components/RootLayout/fonts"
import { TypeBadge } from "@/components/TypeBadge"
import { Process, getProcesses } from "@/services/aoscan"

import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"

import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

import { IdBlock } from "../../components/IdBlock"

type ProcessesTableProps = {
  initialData: Process[]
  pageSize: number
  moduleId?: string
}

const ProcessesTable = (props: ProcessesTableProps) => {
  const { initialData, pageSize, moduleId } = props

  const loaderRef = useRef(null)
  const listSizeRef = useRef(pageSize)

  const [endReached, setEndReached] = useState(false)

  useEffect(() => {
    if (endReached) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log("Intersecting - Fetching more data")
          getProcesses(pageSize, listSizeRef.current, moduleId).then(
            (processes) => {
              console.log(`Fetched another page of ${processes.length} records`)
              if (processes.length === 0) {
                console.log("No more records to fetch")
                observer.disconnect()
                setEndReached(true)
                return
              }

              setData((prevData) => {
                const newData = processes
                const newList = [...prevData, ...newData]
                listSizeRef.current = newList.length
                return newList
              })
            },
          )
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

  const [data, setData] = useState<Process[]>(initialData)
  const [streamingPaused, setStreamingPaused] = useState(false)

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        console.log("Resuming realtime streaming")
        getProcesses(listSizeRef.current, 0, moduleId).then((processes) => {
          console.log(
            `Fetched ${processes.length} records, listSize=${listSizeRef.current}`,
          )
          setData(processes)
          setStreamingPaused(false)
        })
      } else {
        console.log("Pausing realtime streaming")
        setStreamingPaused(true)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return function cleanup() {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const router = useRouter()

  return (
    <Stack marginTop={5} gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle1" sx={{ textTransform: "uppercase" }}>
          Processes
        </Typography>
      </Stack>
      {data.length ? (
        <div>
          <table className="min-w-full">
            <thead className="table-headers">
              <tr>
                <th className="text-start p-2 w-[120px]">Type</th>
                <th className="text-start p-2 w-[220px]">Id</th>
                <th className="text-start p-2">Name</th>
                <th className="text-start p-2 w-[220px]">Module</th>
                <th className="text-end p-2 w-[180px]">Incoming messages</th>
                <th className="text-end p-2 w-[180px]">Latest message</th>
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
                  <td className="text-start p-2">
                    <IdBlock
                      label={truncateId(item.id)}
                      value={item.id}
                      href={`/${TYPE_PATH_MAP[item.type]}/${item.id}`}
                    />
                  </td>
                  <td className="text-start p-2 ">{item.name}</td>
                  <td className="text-start p-2 ">
                    <IdBlock
                      label={truncateId(item.module)}
                      value={item.module}
                      href={`/module/${item.module}`}
                    />
                  </td>
                  <td className="text-end p-2">
                    <Typography
                      fontFamily={MonoFontFF}
                      component="div"
                      variant="inherit"
                    >
                      <IdBlock
                        label={formatNumber(item.incoming_messages)}
                        value={String(item.incoming_messages)}
                      />
                    </Typography>
                  </td>
                  <td className="text-end p-2">
                    <span
                      className="tooltip"
                      data-tip={formatFullDate(item.latest_message)}
                    >
                      {formatRelative(item.latest_message)}
                    </span>
                  </td>
                  <td className="text-end p-2">
                    <span
                      className="tooltip"
                      data-tip={formatFullDate(item.created_at)}
                    >
                      {formatRelative(item.created_at)}
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
          >
            {!endReached && <CircularProgress size={12} color="primary" />}
            <Typography variant="body2" color="text.secondary">
              {endReached
                ? `Total rows: ${data.length}`
                : "Loading more records..."}
            </Typography>
          </Stack>
        </div>
      ) : null}
    </Stack>
  )
}

export default ProcessesTable
