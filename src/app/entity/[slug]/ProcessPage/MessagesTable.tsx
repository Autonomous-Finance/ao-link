"use client"
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { TypeBadge } from "@/components/TypeBadge"
import { getLinkedMessages } from "@/services/aoscan"
import {
  normalizeAoEvent,
  type NormalizedAoEvent,
} from "@/utils/ao-event-utils"

import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"

import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

type MessagesTableProps = {
  processId: string
  tableFilter: {
    from: string
    to: string
  } | null
  setTableFilter: any
}

const pageSize = 30

const MessagesTable = (props: MessagesTableProps) => {
  const { processId, tableFilter: filter, setTableFilter } = props

  const router = useRouter()
  const loaderRef = useRef(null)
  const listSizeRef = useRef(pageSize)

  const [endReached, setEndReached] = useState(false)

  const [data, setData] = useState<NormalizedAoEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getLinkedMessages(pageSize, 0, processId, filter).then((data) => {
      setData(data.map(normalizeAoEvent))
      listSizeRef.current = data.length
      setLoading(false)
    })
  }, [filter, processId])

  useEffect(() => {
    if (endReached) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log("Intersecting - Fetching more data")
          getLinkedMessages(
            pageSize,
            listSizeRef.current,
            processId,
            filter,
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
  }, [endReached, filter, processId])

  return (
    <>
      {data.length ? (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="subtitle1"
              sx={{ textTransform: "uppercase", marginBottom: 3, marginTop: 6 }}
            >
              Linked messages
            </Typography>
            {filter && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setTableFilter(null)}
              >
                Clear filter
              </Button>
            )}
          </Stack>
          <div>
            <table className="min-w-full">
              <thead className="table-headers">
                <tr>
                  <th className="text-start p-2 w-[120px]">Type</th>
                  <th className="text-start p-2">Action</th>
                  <th className="text-start p-2 w-[220px]">ID</th>
                  <th className="text-start p-2 w-[220px]">From</th>
                  <th className="text-start p-2 w-[220px]">To</th>
                  <th className="text-end p-2 w-[160px]">Block Height</th>
                  <th className="text-end p-2 w-[160px]">Created</th>
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
                    <td className="text-start p-2 ">{item.action}</td>
                    <td className="text-start p-2 ">
                      <IdBlock
                        label={truncateId(item.id)}
                        value={item.id}
                        href={`/message/${item.id}`}
                      />
                    </td>
                    <td className="text-start p-2 ">
                      <IdBlock
                        label={truncateId(item.from)}
                        value={item.from}
                        href={`/entity/${item.from}`}
                      />
                    </td>
                    <td className="text-start p-2 ">
                      <IdBlock
                        label={truncateId(item.to)}
                        value={item.to}
                        href={`/entity/${item.to}`}
                      />
                    </td>
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
                    <td className="text-end p-2">
                      {/* TODO */}
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
        </>
      ) : null}
      <Stack
        marginY={2}
        marginX={1}
        ref={loaderRef}
        sx={{
          width: "100%",
          visibility: data.length === 0 ? "hidden" : "visible",
        }}
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
    </>
  )
}

export default MessagesTable
