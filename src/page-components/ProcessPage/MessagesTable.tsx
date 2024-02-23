"use client"
import { CircularProgress, Stack, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

import { MonoFontFF } from "@/components/RootLayout/fonts"
import { TypeBadge } from "@/components/TypeBadge"
import { type NormalizedAoEvent } from "@/utils/ao-event-utils"

import { truncateId } from "@/utils/data-utils"

import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

import { IdBlock } from "../../components/IdBlock"

type MessagesTableProps = {
  data: NormalizedAoEvent[]
}

const pageSize = 30

const MessagesTable = (props: MessagesTableProps) => {
  const { data } = props

  const router = useRouter()
  const loaderRef = useRef(null)

  const [listSize, setListSize] = useState(pageSize)
  const [endReached, setEndReached] = useState(false)

  useEffect(() => {
    if (endReached) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log("Intersecting - Showing more data")
          setListSize((prev) => {
            if (prev + pageSize >= data.length) {
              setEndReached(true)
              return data.length
            }
            return prev + pageSize
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

  return (
    <>
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
                <th className="text-end p-2 w-[160px]">Block Height</th>
                <th className="text-end p-2 w-[160px]">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, listSize).map((item) => (
                <tr
                  className="table-row cursor-pointer"
                  key={item.id}
                  onClick={() => {
                    router.push(
                      item.type === "Message"
                        ? `/message/${item.id}`
                        : `/entity/${item.id}`,
                    )
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
              {endReached
                ? `Total rows: ${data.length}`
                : "Loading more records..."}
            </Typography>
          </Stack>
        </div>
      ) : null}
    </>
  )
}

export default MessagesTable
