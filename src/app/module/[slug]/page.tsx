import { Grid, Stack } from "@mui/material"

import { IdBlock } from "@/components/IdBlock"
import { SectionInfo } from "@/components/SectionInfo"
import { SectionInfoWithChip } from "@/components/SectionInfoWithChip"
import ProcessesTable from "@/page-components/ProcessesPage/ProcessesTable"
import { getModuleById, getProcesses } from "@/services/aoscan"
import { formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

type BlockPageProps = {
  params: { slug: string }
}

export const dynamic = "force-dynamic"

export default async function BlockPage(props: BlockPageProps) {
  const { slug: moduleId } = props.params

  const item = await getModuleById(moduleId)

  if (!item) {
    return <div>Not Found</div>
  }

  const pageSize = 30
  const processes = await getProcesses(pageSize, 0, moduleId)

  return (
    <main className="min-h-screen mb-6">
      <div className="flex gap-2 items-center text-sm mt-12 mb-11">
        <p className="text-[#9EA2AA] ">MODULE</p>
        <p className="font-bold">/</p>
        <IdBlock label={moduleId} />
      </div>
      <Grid container spacing={{ xs: 2, lg: 12 }}>
        <Grid item xs={12} lg={6}>
          <Stack gap={4}>
            <SectionInfoWithChip title="Type" value={"Module"} />
            <SectionInfo
              title="Created"
              value={formatRelative(item.created_at)}
            />
            <SectionInfo
              title="Incoming messages"
              value={formatNumber(item.incoming_messages)}
            />
            <SectionInfo
              title="Processes"
              value={formatNumber(item.processes)}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Stack gap={4}>
            <SectionInfo title="Memory limit" value={item.memory_limit} />
            <SectionInfo
              title="Compute limit"
              value={formatNumber(item.compute_limit)}
            />
            <SectionInfo title="Data protocol" value={item.data_protocol} />
            <SectionInfo title="Input encoding" value={item.input_encoding} />
            <SectionInfo title="Output encoding" value={item.output_encoding} />
            <SectionInfo title="Content Type" value={item.content_type} />
            <SectionInfo title="Module format" value={item.module_format} />
            <SectionInfo title="Variant" value={item.variant} />
          </Stack>
        </Grid>
      </Grid>
      <ProcessesTable
        initialData={processes}
        pageSize={pageSize}
        moduleId={moduleId}
      />
    </main>
  )
}
