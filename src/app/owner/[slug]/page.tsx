import Header from "@/components/Header"
import { IdBlock } from "@/components/IdBlock"
import EventsTable from "@/page-components/HomePage/EventsTable"
import { getAoEventsForOwner } from "@/services/aoscan"
import { normalizeAoEvent } from "@/utils/ao-event-utils"

type OwnerPageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function OwnerPage(props: OwnerPageProps) {
  const { slug: ownerId } = props.params

  const events = (await getAoEventsForOwner(ownerId)) || []
  const initialTableData = events.map(normalizeAoEvent)

  // const pageLimit = 10

  return (
    <main className="min-h-screen mb-6">
      <Header />
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">OWNER</p>
        <p className="font-bold">/</p>
        <div className="">
          <IdBlock value={ownerId} />
        </div>
      </div>

      <div className="text-main-dark-color uppercase mt-[2.75rem] mb-8">
        {events.length} events
      </div>
      <EventsTable
        initialData={initialTableData}
        // initialData={initialTableData.slice(0, pageLimit)}
        // pageLimit={pageLimit}
        ownerId={ownerId}
      />
    </main>
  )
}
