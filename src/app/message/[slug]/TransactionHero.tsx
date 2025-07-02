import { Paper, Stack, Typography, Tooltip } from "@mui/material"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"
import { truncateId } from "@/utils/data-utils"
import { AoMessage } from "@/types"
import { IdBlock } from "@/components/IdBlock"
import { EntityBlock } from "@/components/EntityBlock"

interface Props {
  message: AoMessage
  pushedFor?: string
}

export default function TransactionHero(props: Props) {
  const { message, pushedFor } = props
  const { id, type, from, to, blockHeight, ingestedAt } = message

  return (
    <Paper
      sx={{
        p: { xs: 1, sm: 2 },
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        position: "sticky",
        top: 56,
        zIndex: 1,
      }}
    >
      <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
        <Typography variant="overline" sx={{ fontWeight: 700 }}>
          {type.toUpperCase()}
        </Typography>
        <IdBlock label={truncateId(id)} value={id} />
      </Stack>

      <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          From
        </Typography>
        <EntityBlock entityId={from} />
        {to && (
          <>
            <Typography variant="caption" color="text.secondary">
              → To
            </Typography>
            <EntityBlock entityId={to} />
          </>
        )}
      </Stack>

      <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          Block
        </Typography>
        {blockHeight === null ? (
          <Typography variant="body2">Processing</Typography>
        ) : (
          <IdBlock
            label={formatNumber(blockHeight)}
            value={String(blockHeight)}
            href={`/block/${blockHeight}`}
          />
        )}
      </Stack>

      <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          Seen
        </Typography>
        {ingestedAt ? (
          <Tooltip title={formatFullDate(ingestedAt)}>
            <Typography variant="body2">{formatRelative(ingestedAt)}</Typography>
          </Tooltip>
        ) : (
          <Typography variant="body2">Processing</Typography>
        )}
      </Stack>

      {pushedFor && (
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Pushed&nbsp;for
          </Typography>
          <IdBlock
            label={truncateId(pushedFor)}
            value={pushedFor}
            href={`/message/${pushedFor}`}
          />
        </Stack>
      )}
    </Paper>
  )
} 