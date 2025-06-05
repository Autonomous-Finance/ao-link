import { IconButton, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Chip } from "@mui/material"
import { ArrowUpRight, Globe, Info } from "@phosphor-icons/react"
import React, { memo } from "react"

import { HeaderCell } from "@/components/AsyncTable"
import { IdBlock } from "@/components/IdBlock"
import { ArNSRecord } from "@/services/arns-service"
import { truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"

type ArDomainsTableProps = {
  records: ArNSRecord[]
  loading?: boolean
}

function BaseArDomainsTable(props: ArDomainsTableProps) {
  const { records, loading = false } = props

  const headerCells: HeaderCell[] = [
    { label: "ArNS Name", sx: { width: 240 } },
    { label: "Type", sx: { width: 120 } },
    { label: "ANT Process", sx: { width: 240 } },
    { label: "Undername Limit", sx: { width: 140 }, align: "center" },
    {
      label: (
        <Stack direction="row" gap={0.5} alignItems="center">
          Registered
          <Tooltip title="When the ArNS name was first registered">
            <Info width={16} height={16} />
          </Tooltip>
        </Stack>
      ),
      sx: { width: 160 },
      align: "right",
    },
    {
      label: (
        <Stack direction="row" gap={0.5} alignItems="center">
          Expires
          <Tooltip title="When the ArNS name lease expires (if applicable)">
            <Info width={16} height={16} />
          </Tooltip>
        </Stack>
      ),
      sx: { width: 160 },
      align: "right",
    },
    { label: "Actions", sx: { width: 100 }, align: "center" },
  ]

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            {headerCells.map((cell, index) => (
              <TableCell 
                key={index} 
                sx={cell.sx} 
                align={cell.align}
              >
                {cell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={headerCells.length} align="center">
                Loading ArNS records...
              </TableCell>
            </TableRow>
          ) : records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={headerCells.length} align="center">
                No ArNS names found for this entity.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => {
              const registrationDate = new Date(record.startTimestamp * 1000)
              const expirationDate = record.endTimestamp ? new Date(record.endTimestamp * 1000) : null
              const isExpired = expirationDate && expirationDate < new Date()
              
              return (
                <TableRow key={record.name}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <IconButton 
                        size="small" 
                        href={`https://${record.name}.ar.io`} 
                        target="_blank"
                        title={`Visit ${record.name}.ar.io`}
                      >
                        <Globe size={16} />
                      </IconButton>
                      <span style={{ fontWeight: 500 }}>{record.name}</span>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={record.type === 'permabuy' ? 'Permanent' : 'Lease'} 
                      size="small"
                      color={record.type === 'permabuy' ? 'success' : 'primary'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <IdBlock 
                      label={truncateId(record.processId)} 
                      value={record.processId} 
                      href={`/entity/${record.processId}`} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    {record.undernameLimit}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={formatFullDate(registrationDate)}>
                      <span>{formatRelative(registrationDate)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    {record.type === 'permabuy' ? (
                      <Chip label="Never" size="small" color="success" variant="outlined" />
                    ) : expirationDate ? (
                      <Tooltip title={formatFullDate(expirationDate)}>
                        <Chip 
                          label={formatRelative(expirationDate)} 
                          size="small" 
                          color={isExpired ? 'error' : 'default'}
                          variant="outlined"
                        />
                      </Tooltip>
                    ) : (
                      'Unknown'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      href={`https://arns.ar.io/#/manage/names/${record.name}`} 
                      target="_blank"
                      title="Manage on ArNS.ar.io"
                    >
                      <ArrowUpRight size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </Paper>
  )
}

export const ArDomainsTable = memo(BaseArDomainsTable)
