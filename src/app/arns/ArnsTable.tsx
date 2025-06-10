import React, { memo } from "react"

import { ArnsTableRow } from "./ArnsTableRow"
import { InMemoryTable } from "@/components/InMemoryTable"
import { ArNSRecord } from "@/services/arns-service"

type BaseArnsTableProps = {
  data: ArNSRecord[]
}

function BaseArnsTable(props: BaseArnsTableProps) {
  const { data } = props

  return (
    <InMemoryTable
      initialSortField="startTimestamp"
      initialSortDir="desc"
      data={data}
      pageSize={50}
      headerCells={[
        { label: "Name", sx: { width: "40%" } },
        { label: "ANT Process Id", sx: { width: "40%" } },
        { label: "Created", sx: { width: "20%" } },
      ]}
      renderRow={(record: ArNSRecord) => <ArnsTableRow key={record.name} record={record} />}
    />
  )
}

export const ArnsTable = memo(BaseArnsTable)
