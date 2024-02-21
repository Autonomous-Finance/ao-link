import { IdBlock } from "@/components/IdBlock"
import EventsTable from "@/page-components/HomePage/EventsTable"
import { getAoEventsForBlock } from "@/services/aoscan"
import { normalizeAoEvent } from "@/utils/ao-event-utils"

type BlockPageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function BlockPage(props: BlockPageProps) {
  const { slug: blockHeight } = props.params

  const events = (await getAoEventsForBlock(blockHeight)) || []
  const initialTableData = events.map(normalizeAoEvent)

  return (
    <main className="min-h-screen mb-6">
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">BLOCK</p>
        <p className="font-bold">/</p>
        <IdBlock label={blockHeight} />
      </div>

      <EventsTable
        initialData={initialTableData}
        blockHeight={parseInt(blockHeight)}
      />
    </main>
  )
}
