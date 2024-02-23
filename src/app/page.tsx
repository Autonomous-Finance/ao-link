import { AreaChart } from "@/components/Charts/AreaChart"

import EventsTable from "@/page-components/HomePage/EventsTable"
import SearchBar from "@/page-components/HomePage/SearchBar"
import {
  getMessageStats,
  getModuleStats,
  getProcessStats,
  getTotalMessages,
  getUserStats,
} from "@/services/aometrics"
import { getLatestAoEvents } from "@/services/aoscan"
import { FilterOption } from "@/types"
import { normalizeAoEvent } from "@/utils/ao-event-utils"

export const dynamic = "force-dynamic"

type HomePageProps = {
  searchParams?: {
    filter?: FilterOption
  }
}

export default async function HomePage(props: HomePageProps) {
  const { searchParams = {} } = props
  const { filter } = searchParams
  const pageSize = 30

  const [events, messages, totalMessages, modules, users, processes] =
    await Promise.all([
      getLatestAoEvents(pageSize, 0, filter),
      getMessageStats(),
      getTotalMessages(),
      getModuleStats(),
      getUserStats(),
      getProcessStats(),
    ])

  let initialTableData = events.map(normalizeAoEvent)

  return (
    <main>
      <div className="mt-4">
        <SearchBar />
      </div>
      <div className="flex justify-between flex-wrap mt-[64px] mx-[-24px]">
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          <AreaChart
            data={messages}
            titleText="TOTAL MESSAGES"
            overrideValue={totalMessages}
          />
          <div className="separator"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          <AreaChart data={users} titleText="USERS" />
          <div className="separator hidden lg:block"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          <AreaChart data={processes} titleText="PROCESSES" />
          <div className="separator"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4 min-h-[150px] relative">
          <AreaChart data={modules} titleText="MODULES" />
        </div>
      </div>
      <EventsTable initialData={initialTableData} pageSize={pageSize} />
    </main>
  )
}
