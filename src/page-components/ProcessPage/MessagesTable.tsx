"use client"
import Image from "next/image"
import React, { useEffect, useState } from "react"

import { type AoEvent, subscribeToEvents } from "@/services/aoscan"
import {
  type NormalizedAoEvent,
  normalizeAoEvent,
} from "@/utils/ao-event-utils"

import { TYPE_COLOR_MAP, TYPE_ICON_MAP, truncateId } from "@/utils/data-utils"

import { formatFullDate, formatRelative } from "@/utils/date-utils"

import { IdBlock } from "../../components/IdBlock"

type MessagesTableProps = {
  initialData: NormalizedAoEvent[]
  processId: string
}

const MessagesTable = (props: MessagesTableProps) => {
  const { initialData, processId } = props

  const [data, setData] = useState<NormalizedAoEvent[]>(initialData)

  useEffect(() => {
    const unsubscribe = subscribeToEvents((event: AoEvent) => {
      if (event.target !== processId) return
      console.log("📜 LOG > unsubscribe > event:", event)
      setData((prevData) => {
        const parsed = normalizeAoEvent(event)
        return [parsed, ...prevData.slice(0, 9)]
      })
    })

    return unsubscribe
  }, [])

  return (
    <>
      {data.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-headers">
              <tr>
                <th className="text-start p-2 w-[120px]">Type</th>
                <th className="text-start p-2 w-[160px]">Action</th>
                <th className="text-start p-2 w-[180px]">Message ID</th>
                <th className="text-start p-2 w-[180px]">Owner</th>
                <th className="text-start p-2">Block Height</th>
                <th className="text-start p-2">Scheduler ID</th>
                <th className="text-start p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  className="table-row"
                  key={item.id}
                  // onClick={() => {
                  //   router.push(
                  //     item.type === "Message"
                  //       ? `/message/${item.id}`
                  //       : `/process/${item.id}`,
                  //   )
                  // }}
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
                  <td className="text-start p-2 ">
                    <IdBlock
                      label={truncateId(item.owner)}
                      value={item.owner}
                      href={`/owner/${item.owner}`}
                    />
                  </td>
                  <td className="text-start p-2 ">
                    <IdBlock
                      label={String(item.blockHeight)}
                      href={`/block/${item.blockHeight}`}
                    />
                  </td>
                  <td className="text-start p-2 ">
                    {truncateId(item.schedulerId)}
                  </td>
                  <td className="text-start p-2">
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
