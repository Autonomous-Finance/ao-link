import { AreaChart } from "@/components/Charts/AreaChart"
import Header from "@/components/Header"
import SuggestionInput from "@/components/SuggestionInput"
import Table from "@/components/Table"
import {
  metricsMessages,
  metricsModules,
  metricsProcesses,
  metricsUsers,
} from "@/services/aometrics"
import { aoEvents } from "@/services/aoscan"
import { normalizeAoEvent } from "@/utils/ao-event-utils"

export default async function Home() {
  const events = (await aoEvents()) || []
  const messages = await metricsMessages()

  const modules = await metricsModules()

  const users = await metricsUsers()

  const processes = await metricsProcesses()

  const initialTableData = events.map(normalizeAoEvent)

  return (
    <main>
      <Header />
      <div className="mt-4">
        <SuggestionInput
          eventsIds={events?.map((event) => event.id) as string[]}
        />
      </div>
      <div className="flex justify-between flex-wrap mt-[64px]">
        <div className="container w-1/2 lg:w-1/4 relative px-4">
          {/* Content for the first container */}
          <AreaChart data={messages} titleText="TOTAL MESSAGES" />
          <div className="separator"></div>
        </div>

        <div className="container w-1/2 lg:w-1/4 relative px-4">
          {/* Content for the second container */}
          <AreaChart data={modules} titleText="MODULES" />
          <div className="separator hidden lg:block"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4 relative">
          {/* Content for the third container */}
          <AreaChart data={users} titleText="USERS" />
          <div className="separator"></div>
        </div>
        <div className="container w-1/2 lg:w-1/4 px-4">
          {/* Content for the fourth container */}
          <AreaChart data={processes} titleText="PROCESSES" />
        </div>
      </div>
      <div className="text-main-dark-color uppercase mt-[2.75rem] mb-8">
        Latest
      </div>
      <Table initialData={initialTableData} />
    </main>
  )
}
