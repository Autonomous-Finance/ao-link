import ModulesTable from "@/page-components/ModulesPage/ModulesTable"
import { getModules } from "@/services/aoscan"

export const dynamic = "force-dynamic"

export default async function ModulesPage() {
  const pageSize = 30

  const processes = await getModules(pageSize, 0)

  return (
    <main className="min-h-screen mb-6">
      <ModulesTable initialData={processes} pageSize={pageSize} />
    </main>
  )
}
