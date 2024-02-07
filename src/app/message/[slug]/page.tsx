import { Chip } from "@/components/Chip"
import { Graph } from "@/components/Graph"
import Header from "@/components/Header"
import { IdBlock } from "@/components/IdBlock"

import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import { getAoEventById } from "@/services/aoscan"
import { normalizeAoEvent } from "@/utils/ao-event-utils"
import { truncateId } from "@/utils/data-utils"
import { formatRelative } from "@/utils/date-utils"

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
  const { tags_flat } = event

  return (
    <main className="min-h-screen mb-6">
      <Header />
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">MESSAGE</p>
        <p className="font-bold">/</p>
        <p className="">{truncateId(id)}</p>
      </div>

      <div className="flex w-full">
        <div className="w-1/2 flex flex-col">
          <div className="w-[426px] h-[410px] border border-[#000] flex items-center justify-center mb-6">
            <Graph messageId={id} />
          </div>
          <div>
            <SectionInfo title="Owner" value={<IdBlock value={owner} />} />
            <SectionInfo title="Message ID" value={<IdBlock value={id} />} />
            <SectionInfo
              title="Process ID"
              value={
                <IdBlock value={processId} href={`/process/${processId}`} />
              }
            />
            <SectionInfo title="Created" value={formatRelative(created)} />
          </div>
        </div>
        <div className="flex flex-col items-start justify-start ">
          <SectionInfoWithChip title="Type" value={type} />
          <SectionInfo title="Block Height" value={blockHeight} />
          <div className="mb-12">
            <SectionInfoWithChip title="Compute Results" value={"Compute"} />
            <div className="bg-secondary-gray w-96 min-h-14 flex items-start justify-start -mt-6">
              <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2">
                Waiting to compute...
              </p>
            </div>
          </div>
          <div className="mb-12">
            <div className="flex w-full justify-between items-center mb-6">
              <p className="table-headers">Result Type</p>
            </div>
            <div className="bg-secondary-gray w-96 min-h-14 flex items-start justify-start">
              <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2"></p>
            </div>
          </div>
          <div className="mb-12">
            <div className="flex w-full justify-between items-center mb-6">
              <p className="table-headers">Related Messages Tree:</p>
            </div>
            <div className="bg-secondary-gray w-96 min-h-14 flex items-start justify-start">
              <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2"></p>
            </div>
          </div>
          <div>
            <div className="flex w-full justify-between items-center mb-6">
              <p className="table-headers">Tags:</p>
            </div>
            <div className="bg-secondary-gray w-96 flex items-start justify-start">
              <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2">
                {Object.entries(tags_flat).map(([key, value]) => (
                  <Chip key={key} text={`${key}:${value}`} />
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
