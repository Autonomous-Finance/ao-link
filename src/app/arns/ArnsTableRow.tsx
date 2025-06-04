import { Box, IconButton, Link, Stack, TableCell, TableRow, Typography } from "@mui/material"
import { ArrowUpRight } from "@phosphor-icons/react"

import { IdBlock } from "@/components/IdBlock"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { ArNSRecord } from "@/services/arns-service"
import { formatRelative } from "@/utils/date-utils"
import { truncateId } from "@/utils/data-utils"

type ArnsTableRowProps = {
  record: ArNSRecord
}

export function ArnsTableRow(props: ArnsTableRowProps) {
  const { record } = props

  return (
    <TableRow key={record.name}>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            size="small"
            component="a"
            href={`https://${record.name}.ar.io`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'text.secondary' }}
          >
            <ArrowUpRight size={16} />
          </IconButton>
          <Typography fontFamily={MonoFontFF} variant="inherit" component="div">
            <Link
              href={`https://arns.ar.io/#/manage/names/${record.name}`}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="inherit"
            >
              {record.name}
            </Link>
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography fontFamily={MonoFontFF} variant="inherit" component="div">
          <IdBlock
            label={truncateId(record.processId)}
            value={record.processId}
            href={`/entity/${record.processId}`}
          />
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {formatRelative(new Date(record.startTimestamp))}
        </Typography>
      </TableCell>
    </TableRow>
  )
}
