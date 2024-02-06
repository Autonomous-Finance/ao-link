"use client"
import { AoEvent, aoEvents } from "@/services/aoscan"
import { NormalizedAoEvent, normalizeAoEvent } from "@/utils/ao-event-utils"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { truncateId } from "@/utils/data-utils"
import { Loader } from "./Loader"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

type DataTableProps = {
  initialData: NormalizedAoEvent[]
}

const DataTable = (props: DataTableProps) => {
  const { initialData } = props

  const [data, setData] = useState<NormalizedAoEvent[]>(initialData)

  useEffect(() => {
    const getUserInfo = async () => {
      const events = await aoEvents()
      if (events) {
        const parsed = events.map(normalizeAoEvent)
        setData(parsed)
      }
    }

    setInterval(() => getUserInfo(), 5000)
  }, [])

  // useEffect(() => {
  //   const unsubscribe = subscribeToEvents((event: AoEvent) => {
  //     setData((prevData) => {
  //       const parsed = normalizeAoEvent(event)
  //       return [parsed, ...prevData.slice(0, 29)]
  //     })
  //   })

  //   return unsubscribe
  // }, [])

  const router = useRouter()

  return (
    <>
      {data.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-headers">
              <tr>
                <th className="text-start p-2">Type</th>
                <th className="text-start p-2">Action</th>
                <th className="text-start p-2">Message ID</th>
                <th className="text-start p-2">Process ID</th>
                <th className="text-start p-2">Owner</th>
                <th className="text-start p-2">Block Height</th>
                <th className="text-start p-2">Scheduler ID</th>
                <th className="text-start p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  className="table-row"
                  key={item.messageId || item.processId}
                  onClick={() => {
                    router.push(`/${item.messageId}`)
                  }}
                >
                  <td className="text-start p-2">
                    <div
                      className={`gap-2 inline-flex px-2 py-1 ${
                        item.type === "Process"
                          ? "bg-[#FEEEE5]"
                          : "bg-[#E2F0DC]"
                      }`}
                    >
                      <p>{item.type}</p>
                      <Image
                        alt="icon"
                        width={8}
                        height={8}
                        src={
                          item.type === "Process"
                            ? "process.svg"
                            : "message.svg"
                        }
                      />
                    </div>
                  </td>
                  <td className="text-start p-2 ">
                    <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {item.action}
                    </p>
                  </td>
                  <td className="text-start p-2 ">
                    <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {truncateId(item.messageId)}
                    </p>
                  </td>
                  <td className="text-start p-2">
                    <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {truncateId(item.processId)}
                    </p>
                  </td>
                  <td className="text-start p-2 ">
                    <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {truncateId(item.owner)}
                    </p>
                  </td>
                  <td className="text-start p-2 ">{item.blockHeight}</td>
                  <td className="text-start p-2 ">
                    <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {truncateId(item.schedulerId)}
                    </p>
                  </td>
                  <td
                    className="text-start p-2 tooltip"
                    data-tip={formatFullDate(item.created)}
                  >
                    <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {formatRelative(item.created)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}
    </>
  )
}

export default DataTable
