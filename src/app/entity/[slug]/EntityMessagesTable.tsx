import { Paper, TableCell, TableRow, Tooltip } from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"

import { AsyncTable, AsyncTableProps } from "@/components/AsyncTable"
import { IdBlock } from "@/components/IdBlock"
import { InOutLabel } from "@/components/InOutLabel"
import { TypeBadge } from "@/components/TypeBadge"
import { AoMessage } from "@/utils/ao-event-utils"
import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

type EntityMessagesTableProps = Pick<AsyncTableProps, "fetchFunction" | "pageSize"> & {
  entityId: string
}

export function EntityMessagesTable(props: EntityMessagesTableProps) {
  const { entityId, ...rest } = props
  const router = useRouter()

  return (
    <AsyncTable
      {...rest}
      component={Paper}
      initialSortDir="desc"
      initialSortField="created"
      headerCells={[
        { label: "Type", sx: { width: 140 } },
        { label: "Action" },
        { label: "ID", sx: { width: 220 } },
        { label: "From", sx: { width: 220 } },
        { label: "", sx: { width: 60 } },
        { label: "To", sx: { width: 220 } },
        {
          label: "Block Height",
          sx: { width: 160 },
          align: "right",
        },
        {
          field: "created",
          label: "Created",
          sx: { width: 160 },
          align: "right",
          sortable: true,
        },
      ]}
      renderRow={(item: AoMessage) => (
        <TableRow
          sx={{ cursor: "pointer" }}
          key={item.id}
          onClick={() => {
            router.push(`/${TYPE_PATH_MAP[item.type]}/${item.id}`)
          }}
        >
          <TableCell>
            <TypeBadge type={item.type} />
          </TableCell>
          <TableCell>{item.action}</TableCell>
          <TableCell>
            <IdBlock label={truncateId(item.id)} value={item.id} href={`/message/${item.id}`} />
          </TableCell>
          <TableCell>
            <IdBlock
              label={truncateId(item.from)}
              value={item.from}
              href={`/entity/${item.from}`}
            />
          </TableCell>
          <TableCell>
            <InOutLabel outbound={entityId !== item.to} />
          </TableCell>
          <TableCell>
            <IdBlock label={truncateId(item.to)} value={item.to} href={`/entity/${item.to}`} />
          </TableCell>
          <TableCell align="right">
            {item.blockHeight === null ? (
              "Processing"
            ) : (
              <IdBlock
                label={formatNumber(item.blockHeight)}
                value={String(item.blockHeight)}
                href={`/block/${item.blockHeight}`}
              />
            )}
          </TableCell>
          <TableCell align="right">
            <Tooltip title={formatFullDate(item.created)}>
              <span>{formatRelative(item.created)}</span>
            </Tooltip>
          </TableCell>
        </TableRow>
      )}
    />
  )
}
