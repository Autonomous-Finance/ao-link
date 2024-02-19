import { Chip } from "@/components/Chip"
import { Graph } from "@/components/Graph"
import Header from "@/components/Header"
import { IdBlock } from "@/components/IdBlock"

import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { getAoEventById } from "@/services/aoscan"
import { normalizeAoEvent, normalizeTags } from "@/utils/ao-event-utils"
import { truncateId } from "@/utils/data-utils"
import { formatRelative } from "@/utils/date-utils"
import { getColorFromText } from "@/utils/tailwind-utils"

type MessagePageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function MessagePage(props: MessagePageProps) {
  const { slug: messageId } = props.params

  const event = await getAoEventById(messageId)

  if (!event) {
    return <div>Not Found</div>
  }

  const normalizedEvent = normalizeAoEvent(event)

  const { id, owner, type, blockHeight, created, processId } = normalizedEvent
  const tags = normalizeTags(event.tags_flat)

  let data = ""
  try {
    const dataResponse = await fetch(`https://arweave.net/${messageId}`)
    data = await dataResponse.text()
  } catch (error) {
    console.log("📜 LOG > MessagePage > arweave.net error:", error)
  }

  return (
    <main className="min-h-screen mb-6">
      <Header />
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">MESSAGE</p>
        <p className="font-bold">/</p>
        <IdBlock label={id} />
      </div>

      <div className="flex w-full">
        <div className="w-1/2 flex flex-col">
          <div className="w-[426px] h-[410px] border border-[#000] flex items-center justify-center mb-6">
            <Graph messageId={id} />
          </div>
          <div className="flex flex-col gap-8">
            <SectionInfoWithChip title="Type" value={type} />
            <SectionInfo
              title="Owner"
              value={
                <IdBlock
                  label={truncateId(owner)}
                  value={owner}
                  href={`/owner/${owner}`}
                />
              }
            />
            <SectionInfo
              title="Process ID"
              value={
                <IdBlock
                  label={truncateId(processId)}
                  value={processId}
                  href={`/process/${processId}`}
                />
              }
            />
            <SectionInfo
              title="Block Height"
              value={
                <IdBlock
                  label={String(blockHeight)}
                  href={`/block/${blockHeight}`}
                />
              }
            />
            <SectionInfo title="Created" value={formatRelative(created)} />
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-8">
          <div>
            <div className="mb-2">
              <p className="table-headers">Tags:</p>
            </div>
            <div className="bg-secondary-gray w-96 flex items-start justify-start">
              <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2">
                {Object.entries(tags).map(([key, value]) => (
                  <Chip key={key} className={getColorFromText(key)}>
                    {key}:{value}
                  </Chip>
                ))}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <SectionInfoWithChip title="Compute Result" value={"Compute"} />
            </div>
            <div className="bg-secondary-gray w-96 min-h-14 flex items-start justify-start">
              <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2">
                Waiting to compute...
              </p>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <p className="table-headers">Data</p>
            </div>
            <div className="bg-secondary-gray w-96 min-h-14 flex items-start justify-start">
              <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2">
                {data}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <p className="table-headers">Result Type</p>
            </div>
            <div className="bg-secondary-gray w-96 min-h-14 flex items-start justify-start">
              <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2">
                JSON
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
