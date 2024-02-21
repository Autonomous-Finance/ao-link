import { Chip } from "@/components/Chip"
import { Graph } from "@/components/Graph"
import { IdBlock } from "@/components/IdBlock"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import MessagesTable from "@/page-components/ProcessPage/MessagesTable"
import { getAoEventById, getLatestMessagesForProcess } from "@/services/aoscan"
import { normalizeAoEvent, normalizeTags } from "@/utils/ao-event-utils"
import { truncateId } from "@/utils/data-utils"
import { formatRelative } from "@/utils/date-utils"
import { getColorFromText } from "@/utils/tailwind-utils"

type ProcessPageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function ProcessPage(props: ProcessPageProps) {
  const { slug: processId } = props.params

  const event = await getAoEventById(processId)

  if (!event) {
    return <div>Not Found</div>
  }

  const normalizedEvent = normalizeAoEvent(event)

  const { id, owner, type, blockHeight, created } = normalizedEvent
  const tags = normalizeTags(event.tags_flat)

  const events = (await getLatestMessagesForProcess(processId)) || []
  const initialTableData = events.map(normalizeAoEvent)

  return (
    <main className="min-h-screen mb-6">
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">PROCESS</p>
        <p className="font-bold">/</p>
        <IdBlock label={id} />
      </div>

      <div className="flex w-full">
        <div className="w-1/2 flex flex-col">
          <div className="w-[426px] h-[410px] border border-[#000] flex items-center justify-center mb-6">
            <Graph messageId={id} isProcess />
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
      <div className="text-main-dark-color uppercase mt-[2.75rem] mb-8">
        Latest messages
      </div>
      <MessagesTable initialData={initialTableData} processId={processId} />
    </main>
  )
}
