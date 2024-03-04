"use client"
import {
  Box,
  CircularProgress,
  LinearProgress,
  Stack,
  TableSortLabel,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

import { MonoFontFF } from "@/components/RootLayout/fonts"
import { TypeBadge } from "@/components/TypeBadge"
import { Module, getModules } from "@/services/aoscan"

import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"

import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

import { IdBlock } from "../../components/IdBlock"

type ModulesTableProps = {
  initialData: Module[]
  pageSize: number
}

const ModulesTable = (props: ModulesTableProps) => {
  const { initialData, pageSize } = props

  const loaderRef = useRef(null)
  const listSizeRef = useRef(pageSize)

  const [endReached, setEndReached] = useState(false)

  const [sortAscending, setSortAscending] = useState<boolean>(false)
  const [sortField, setSortField] = useState<
    "created_at" | "processes" | "incoming_messages"
  >("incoming_messages")

  const [data, setData] = useState<Module[]>(initialData)

  useEffect(() => {
    if (endReached) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log("Intersecting - Fetching more data")
          getModules(
            pageSize,
            listSizeRef.current,
            sortField,
            sortAscending,
          ).then((processes) => {
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
  }, [endReached, pageSize, sortAscending, sortField])

  const [loading, setLoading] = useState(false)
  const [firstRender, setFirstRender] = useState(true)

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false)
      return
    }
    setLoading(true)
    console.log("Sorting changed - Fetching data")
    getModules(listSizeRef.current, 0, sortField, sortAscending)
      .then((processes) => {
        setData(processes)
      })
      .finally(() => {
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, sortAscending])

  // const [streamingPaused, setStreamingPaused] = useState(false)
  // useEffect(() => {
  //   function handleVisibilityChange() {
  //     if (document.visibilityState === "visible") {
  //       console.log("Resuming realtime streaming")
  //       getModules(listSizeRef.current, 0).then((processes) => {
  //         console.log(
  //           `Fetched ${processes.length} records, listSize=${listSizeRef.current}`,
  //         )
  //         setData(processes)
  //         setStreamingPaused(false)
  //       })
  //     } else {
  //       console.log("Pausing realtime streaming")
  //       setStreamingPaused(true)
  //     }
  //   }

  //   document.addEventListener("visibilitychange", handleVisibilityChange)

  //   return function cleanup() {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange)
  //   }
  // }, [])

  const router = useRouter()

  return (
    <Stack marginTop={5} gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle1" sx={{ textTransform: "uppercase" }}>
          Modules
        </Typography>
      </Stack>
      {data.length ? (
        <div>
          <table className="min-w-full">
            <thead className="table-headers">
              <tr>
                <th className="text-start p-2 w-[120px]">Type</th>
                <th className="text-start p-2 ">Id</th>
                <th className="text-end p-2 w-[240px]">Memory limit</th>
                <th className="text-end p-2 w-[240px]">Compute limit</th>
                <th className="text-end p-2 w-[180px]">
                  <TableSortLabel
                    active={sortField === "incoming_messages"}
                    direction={sortAscending ? "asc" : "desc"}
                    onClick={() => {
                      if (sortField !== "incoming_messages") {
                        setSortField("incoming_messages")
                      } else {
                        setSortAscending(!sortAscending)
                      }
                    }}
                  >
                    Incoming messages
                  </TableSortLabel>
                </th>
                <th className="text-end p-2 w-[180px]">
                  <TableSortLabel
                    active={sortField === "processes"}
                    direction={sortAscending ? "asc" : "desc"}
                    onClick={() => {
                      if (sortField !== "processes") {
                        setSortField("processes")
                      } else {
                        setSortAscending(!sortAscending)
                      }
                    }}
                  >
                    Processes
                  </TableSortLabel>
                </th>
                <th className="text-end p-2 w-[160px]">
                  <TableSortLabel
                    active={sortField === "created_at"}
                    direction={sortAscending ? "asc" : "desc"}
                    onClick={() => {
                      if (sortField !== "created_at") {
                        setSortField("created_at")
                      } else {
                        setSortAscending(!sortAscending)
                      }
                    }}
                  >
                    Created
                  </TableSortLabel>
                </th>
              </tr>
              <tr>
                <td colSpan={99}>
                  {loading ? (
                    <LinearProgress
                      color="primary"
                      variant="indeterminate"
                      sx={{ height: 2, marginX: 1 }}
                    />
                  ) : (
                    <Box sx={{ height: 2 }} />
                  )}
                </td>
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
                  <td className="text-end p-2 ">
                    <Typography
                      fontFamily={MonoFontFF}
                      component="div"
                      variant="inherit"
                    >
                      <IdBlock label={item.memory_limit} />
                    </Typography>
                  </td>
                  <td className="text-end p-2 ">
                    <Typography
                      fontFamily={MonoFontFF}
                      component="div"
                      variant="inherit"
                    >
                      <IdBlock
                        label={formatNumber(item.compute_limit)}
                        value={String(item.compute_limit)}
                      />
                    </Typography>
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
                    <Typography
                      fontFamily={MonoFontFF}
                      component="div"
                      variant="inherit"
                    >
                      <IdBlock
                        label={formatNumber(item.processes)}
                        value={String(item.processes)}
                      />
                    </Typography>
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

export default ModulesTable
