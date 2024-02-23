"use client"
import { Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

import { MonoFontFF } from "@/components/RootLayout/fonts"
import { TypeBadge } from "@/components/TypeBadge"
import { type AoEvent, subscribeToEvents } from "@/services/aoscan"
import {
  type NormalizedAoEvent,
  normalizeAoEvent,
} from "@/utils/ao-event-utils"

import { truncateId } from "@/utils/data-utils"

import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { formatNumber } from "@/utils/number-utils"

import { IdBlock } from "../../components/IdBlock"

type MessagesTableProps = {
  initialData: NormalizedAoEvent[]
  processId?: string
}

const MessagesTable = (props: MessagesTableProps) => {
  const { initialData, processId } = props

  const [data, setData] = useState<NormalizedAoEvent[]>(initialData)

  useEffect(() => {
    if (!processId) return
    const unsubscribe = subscribeToEvents((event: AoEvent) => {
      if (event.target !== processId) return
      console.log("📜 LOG > subscribe > event:", event)
      setData((prevData) => {
        const parsed = normalizeAoEvent(event)
        return [parsed, ...prevData.slice(0, 9)]
      })
    })

    return unsubscribe
  }, [processId])

  const router = useRouter()

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
              {data.map((item) => (
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
    </>
  )
}

export default MessagesTable
