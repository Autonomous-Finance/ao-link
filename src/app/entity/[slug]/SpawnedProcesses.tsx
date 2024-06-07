import React from "react"

import { getSpawnedProcesses } from "@/services/messages-api"

import { ProcessesTable } from "./ProcessesTable"

type SpawnedProcessesProps = {
  entityId: string
  open: boolean
  onCountReady?: (count: number) => void
  isProcess?: boolean
}

export function SpawnedProcesses(props: SpawnedProcessesProps) {
  const { entityId, open, onCountReady, isProcess } = props

  if (!open) return null

  const pageSize = 25

  return (
    <ProcessesTable
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getSpawnedProcesses(
          pageSize,
          lastRecord?.cursor,
          ascending,
          entityId,
          isProcess,
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}