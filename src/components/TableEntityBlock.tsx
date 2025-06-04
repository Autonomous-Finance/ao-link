import { Typography } from "@mui/material"

import { IdBlock } from "./IdBlock"
import { MonoFontFF } from "./RootLayout/fonts"
import { truncateId } from "@/utils/data-utils"

type TableEntityBlockProps = {
  entityId: string
  fullId?: boolean
}

/**
 * Lightweight EntityBlock component for table rows
 * Displays only the entity ID as a clickable link without any ArNS lookups
 * This prevents the excessive API calls that were happening with full EntityBlock components
 */
export function TableEntityBlock(props: TableEntityBlockProps) {
  const { entityId, fullId } = props

  return (
    <Typography fontFamily={MonoFontFF} variant="inherit" component="div">
      <IdBlock
        label={fullId ? entityId : truncateId(entityId)}
        value={entityId}
        href={`/entity/${entityId}`}
      />
    </Typography>
  )
}