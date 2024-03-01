import ProcessesTable from "@/page-components/ProcessesPage/ProcessesTable"
import { getProcesses } from "@/services/aoscan"

export const dynamic = "force-dynamic"

export default async function ProcessesPage() {
  const pageSize = 30
  const processes = await getProcesses(pageSize, 0)

  return (
    <main className="min-h-screen mb-6">
      <ProcessesTable initialData={processes} pageSize={pageSize} />
    </main>
  )
}
