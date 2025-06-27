import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import React, { memo } from "react"

import { AsyncTable, AsyncTableProps } from "@/components/AsyncTable"
import { IdBlock } from "@/components/IdBlock"
import { TypeBadge } from "@/components/TypeBadge"
import { getLinkedMessages, getResultingMessages } from "@/services/messages-api"
import { AoMessage } from "@/types"
import { truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { TableRow, TableCell } from "@mui/material"
import { useNavigate } from "react-router-dom"

interface Props {
  message: AoMessage
  computeResult: any
  pageSize: number
  onCountReady?: (c: number) => void
  onDataReady?: (d: AoMessage[]) => void
}

// add flag indicating direction
interface DirMessage extends AoMessage {
  _dir: "in" | "out"
}

function BaseCombinedTable(props: Props) {
  const { message, computeResult, pageSize, onCountReady, onDataReady } = props
  const pushedFor = message.tags["Pushed-For"]

  const navigate = useNavigate()

  return (
    <AsyncTable
      component="div"
      pageSize={pageSize}
      initialSortDir="desc"
      initialSortField="ingestedAt"
      headerCells={[
        { label: "Dir", sx: { width: 40 } },
        { label: "ID", sx: { width: 240 } },
        { label: "Type", sx: { width: 120 } },
        { label: "Age", align: "right", sx: { width: 120 } },
      ]}
      fetchFunction={async (offset, ascending, sortField, last) => {
        // On first call we need both resulting and first page of linked.

        const linkedCursor = last?.cursor ?? undefined

        const [linkedCountRaw, linked] = await getLinkedMessages(
          pageSize,
          linkedCursor,
          ascending,
          pushedFor || message.id,
        )

        let resulting: AoMessage[] = []
        let resultingCount = 0
        if (offset === 0) {
          const res = await getResultingMessages(
            pageSize,
            undefined,
            ascending,
            pushedFor || message.id,
            message.to,
            [],
            false,
          )
          resultingCount = res[0] ?? 0
          resulting = res[1]
        }

        const linkedCount = linkedCountRaw || 0
        const totalCount = linkedCount + resultingCount
        if (onCountReady) onCountReady(totalCount)

        const merged: DirMessage[] = [
          ...resulting.map((m) => ({ ...(m as any), _dir: "out" })),
          ...linked.map((m) => ({ ...(m as any), _dir: "in" })),
        ]

        if (onDataReady) onDataReady(merged)
        return merged
      }}
      renderRow={(row: DirMessage) => {
        return (
          <TableRow
            key={row.id}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/message/${row.id}`)}
          >
            <TableCell>
              {row._dir === "out" ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </TableCell>
            <TableCell>
              <IdBlock label={truncateId(row.id)} value={row.id} />
            </TableCell>
            <TableCell>
              <TypeBadge type={row.type} />
            </TableCell>
            <TableCell align="right">
              {row.ingestedAt ? formatRelative(row.ingestedAt) : "-"}
            </TableCell>
          </TableRow>
        )
      }}
      virtualize
    />
  )
}

export const CombinedMessagesTable = memo(BaseCombinedTable) 