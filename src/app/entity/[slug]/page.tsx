import { IdBlock } from "@/components/IdBlock"
import { supabase } from "@/lib/supabase"
import EventsTable from "@/page-components/HomePage/EventsTable"
import {
  getAoEventById,
  getLatestAoEvents,
  getProcessById,
} from "@/services/aoscan"

import { normalizeAoEvent } from "@/utils/ao-event-utils"

import { ProcessPage } from "./ProcessPage/ProcessPage"

type EntityPageServerProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function EntityPageServer(props: EntityPageServerProps) {
  const { slug: entityId } = props.params

  const { data, error } = await supabase
    .rpc("determine_entity_type", {
      entity_id: entityId,
    })
    .returns<"user" | "process">()

  if (error || !data) {
    console.error("Error calling Supabase RPC:", error.message)
    return <>Entity not found</>
  }

  if (data === "user") {
    const ownerId = entityId

    const pageSize = 30

    const events = await getLatestAoEvents(
      pageSize,
      undefined,
      undefined,
      undefined,
      ownerId,
    )
    const initialTableData = events.map(normalizeAoEvent)

    return (
      <main className="min-h-screen mb-6">
        <div className="flex gap-2 items-center text-sm mt-12 mb-11">
          <p className="text-[#9EA2AA] ">USER</p>
          <p className="font-bold">/</p>
          <IdBlock label={ownerId} />
        </div>
        <EventsTable
          initialData={initialTableData}
          pageSize={pageSize}
          ownerId={ownerId}
        />
      </main>
    )
  }

  const processId = entityId

  const event = await getAoEventById(processId)
  const process = await getProcessById(processId)

  if (!event || !process) {
    return <div>Not Found</div>
  }

  return <ProcessPage event={event} process={process} />
}
