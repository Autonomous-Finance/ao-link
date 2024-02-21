import { AreaChart } from "@/components/Charts/AreaChart"

import EventsTable from "@/page-components/HomePage/EventsTable"
import SearchBar from "@/page-components/HomePage/SearchBar"
import {
  getMessageStats,
  getModuleStats,
  getProcessStats,
  getUserStats,
} from "@/services/aometrics"
import { getLatestAoEvents } from "@/services/aoscan"
import { normalizeAoEvent } from "@/utils/ao-event-utils"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [messages, modules, users, processes] = await Promise.all([
    getMessageStats(),
    getModuleStats(),
    getUserStats(),
    getProcessStats(),
  ])

  const pageLimit = 30

  const events = (await getLatestAoEvents(pageLimit)) || []
  const initialTableData = events.map(normalizeAoEvent)

  return (
    <main>
      <div className="mt-4">
        <SearchBar />
      </div>
      <div className="flex justify-between flex-wrap mt-[64px] mx-[-24px]">
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          <AreaChart data={messages} titleText="TOTAL MESSAGES" />
          <div className="separator"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          <AreaChart data={modules} titleText="MODULES" />
          <div className="separator hidden lg:block"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          <AreaChart data={users} titleText="USERS" />
          <div className="separator"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          <AreaChart data={processes} titleText="PROCESSES" />
        </div>
      </div>
      <EventsTable initialData={initialTableData} pageLimit={pageLimit} />
    </main>
  )
}
