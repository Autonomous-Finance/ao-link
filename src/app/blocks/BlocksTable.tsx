import { Paper, TableCell, TableRow, Tooltip } from "@mui/material"
import React from "react"

import { useNavigate } from "react-router-dom"

import { AsyncTable, AsyncTableProps } from "@/components/AsyncTable"
import { IdBlock } from "@/components/IdBlock"
import { TypeBadge } from "@/components/TypeBadge"
import { ArweaveBlock } from "@/utils/arweave-utils"
import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

import { RetryableMsgCount } from "./RetryableMsgCount"

type BlocksTableProps = Pick<AsyncTableProps, "fetchFunction" | "pageSize">

export function BlocksTable(props: BlocksTableProps) {
  const navigate = useNavigate()

  return (
    <AsyncTable
      {...props}
      component={Paper}
      initialSortDir="desc"
      initialSortField="blockHeight"
      headerCells={[
        { label: "Type", sx: { width: 140 } },
        { label: "ID", sx: { width: 220 } },
        { label: "Messages", align: "right", sx: { width: 160 } },
        {
          field: "blockHeight",
          label: "Block Height",
          sx: { width: 160 },
          align: "right",
          sortable: true,
        },
        {
          label: "Created",
          sx: { width: 160 },
          align: "right",
        },
      ]}
      renderRow={(item: ArweaveBlock) => (
        <TableRow
          sx={{ cursor: "pointer" }}
          key={item.id}
          onClick={() => {
            navigate(`/${TYPE_PATH_MAP["Block"]}/${item.height}`)
          }}
        >
          <TableCell>
            <TypeBadge type={"Block"} />
          </TableCell>
          <TableCell>
            <IdBlock label={truncateId(item.id)} value={item.id} />
          </TableCell>
          <TableCell align="right">
            <RetryableMsgCount blockHeight={item.height} />
          </TableCell>
          <TableCell align="right">
            {item.height === null ? (
              "Processing"
            ) : (
              <IdBlock
                label={formatNumber(item.height)}
                value={String(item.height)}
                href={`/block/${item.height}`}
              />
            )}
          </TableCell>
          <TableCell align="right">
            {item.timestamp === null ? (
              "Processing"
            ) : (
              <Tooltip title={formatFullDate(item.timestamp)}>
                <span>{formatRelative(item.timestamp)}</span>
              </Tooltip>
            )}
          </TableCell>
        </TableRow>
      )}
    />
  )
}
