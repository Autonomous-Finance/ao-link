import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material"
import { FunnelSimple } from "@phosphor-icons/react"
import React, { useState } from "react"

import { useNavigate } from "react-router-dom"

import { AsyncTable, AsyncTableProps, HeaderCell } from "@/components/AsyncTable"
import { EntityBlock } from "@/components/EntityBlock"
import { IdBlock } from "@/components/IdBlock"
import { InOutLabel } from "@/components/InOutLabel"
import { TypeBadge } from "@/components/TypeBadge"
import { AoMessage, MSG_TYPES } from "@/types"
import { TYPE_ICON_MAP, TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

type EntityMessagesTableProps = Pick<AsyncTableProps, "fetchFunction" | "pageSize"> & {
  entityId?: string
  hideBlockColumn?: boolean
  allowTypeFilter?: boolean
}

export function EntityMessagesTable(props: EntityMessagesTableProps) {
  const { entityId, hideBlockColumn, allowTypeFilter, ...rest } = props
  const navigate = useNavigate()

  const [extraFilters, setExtraFilters] = useState<Record<string, string>>({})

  const [filterTypeAnchor, setFilterTypeAnchor] = useState<null | HTMLElement>(null)
  const handleFilterTypeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterTypeAnchor(event.currentTarget)
  }
  const handleFilterTypeClose = () => {
    setFilterTypeAnchor(null)
  }

  const headerCells: HeaderCell[] = [
    {
      label: !allowTypeFilter ? (
        "Type"
      ) : (
        <Stack direction="row" gap={0.5} sx={{ marginY: -1 }} alignItems="center">
          <span>Type</span>
          <Tooltip title={"Filter by type"}>
            <IconButton size="small" onClick={handleFilterTypeClick}>
              <FunnelSimple width={18} height={18} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={filterTypeAnchor}
            open={Boolean(filterTypeAnchor)}
            onClose={handleFilterTypeClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem
              onClick={() => {
                handleFilterTypeClose()
                setExtraFilters({})
              }}
              selected={Object.keys(extraFilters).length === 0}
            >
              <i>All</i>
            </MenuItem>
            {MSG_TYPES.map((msgType) => (
              <MenuItem
                onClick={() => {
                  handleFilterTypeClose()
                  setExtraFilters({ Type: msgType })
                }}
                selected={extraFilters.Type === msgType}
              >
                <Box sx={{ marginRight: 1 }}>{msgType}</Box>
                {TYPE_ICON_MAP[msgType] && (
                  <img alt="icon" width={10} height={10} src={TYPE_ICON_MAP[msgType]} />
                )}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      ),
      sx: { width: 140 },
    },
    { label: "ID", sx: { width: 240 } },
    { label: "Action" },
    { label: "From", sx: { width: 240 } },
    { label: "", sx: { width: 60 } },
    { label: "To", sx: { width: 240 } },
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
  ]

  if (hideBlockColumn) {
    headerCells.splice(6, 1)
  }

  return (
    <AsyncTable
      extraFilters={extraFilters}
      {...rest}
      component={Paper}
      initialSortDir="desc"
      initialSortField="blockHeight"
      headerCells={headerCells}
      renderRow={(item: AoMessage) => (
        <TableRow
          sx={{ cursor: "pointer" }}
          key={item.id}
          onClick={() => {
            navigate(`/${TYPE_PATH_MAP[item.type]}/${item.id}`)
          }}
        >
          <TableCell>
            <TypeBadge type={item.type} />
          </TableCell>
          <TableCell>
            <IdBlock label={truncateId(item.id)} value={item.id} href={`/message/${item.id}`} />
          </TableCell>
          <TableCell>{item.action}</TableCell>
          <TableCell>
            <EntityBlock entityId={item.from} />
          </TableCell>
          <TableCell>
            {entityId !== undefined && <InOutLabel outbound={entityId !== item.to} />}
          </TableCell>
          <TableCell>
            <EntityBlock entityId={item.to} />
          </TableCell>
          {!hideBlockColumn && (
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
          )}
          <TableCell align="right">
            {item.created === null ? (
              "Processing"
            ) : (
              <Tooltip title={formatFullDate(item.created)}>
                <span>{formatRelative(item.created)}</span>
              </Tooltip>
            )}
          </TableCell>
        </TableRow>
      )}
    />
  )
}
