"use client"
import { AoEvent, aoEvents, subscribeToEvents } from "@/services/aoscan"
import { NormalizedAoEvent, normalizeAoEvent } from "@/utils/ao-event-utils"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import { truncateId } from "@/utils/data-utils"
import { Loader } from "./Loader"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IdBlock } from "./IdBlock"

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

  useEffect(() => {
    const unsubscribe = subscribeToEvents((event: AoEvent) => {
      console.log("📜 LOG > unsubscribe > event:", event)
      setData((prevData) => {
        const parsed = normalizeAoEvent(event)
        return [parsed, ...prevData.slice(0, 29)]
      })
    })

    return unsubscribe
  }, [])

  const router = useRouter()

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
                <th className="text-start p-2 w-[180px]">Process ID</th>
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
                        item.type === "Process"
                          ? "bg-[#FEEEE5]"
                          : "bg-[#E2F0DC]"
                      }`}
                    >
                      <p className="uppercase">{item.type}</p>
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
                  <td className="text-start p-2 ">{item.action}</td>
                  <td className="text-start p-2 ">
                    <IdBlock
                      value={item.messageId}
                      href={`/message/${item.messageId}`}
                    />
                  </td>
                  <td className="text-start p-2">
                    <IdBlock
                      value={item.processId}
                      href={`/process/${item.processId}`}
                    />
                  </td>
                  <td className="text-start p-2 ">{truncateId(item.owner)}</td>
                  <td className="text-start p-2 ">{item.blockHeight}</td>
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
      ) : (
        <Loader />
      )}
    </>
  )
}

export default DataTable
