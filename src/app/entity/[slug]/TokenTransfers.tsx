import { Paper } from "@mui/material"
import React, { useEffect, useState } from "react"

import { getTokenTransfers } from "@/services/messages-api"
import { TokenEvent, normalizeTokenEvent } from "@/utils/ao-event-utils"

import { TokenTransfersTable } from "./TokenTransfersTable"

type TokenTransfersProps = {
  entityId: string
  open: boolean
}

export function TokenTransfers(props: TokenTransfersProps) {
  const { entityId, open } = props
  const [data, setData] = useState<TokenEvent[]>([])

  const pageSize = 1000

  useEffect(() => {
    getTokenTransfers(pageSize, undefined, entityId).then((events) => {
      const parsed = events.map(normalizeTokenEvent)
      setData(parsed)
    })
  }, [entityId])

  if (!open) return null

  return (
    <Paper>
      <TokenTransfersTable data={data} />
    </Paper>
  )
}
