import { Paper } from "@mui/material"
import { useEffect, useState } from "react"

import { InMemoryTable } from "@/components/InMemoryTable"
import { getTokenTransfers } from "@/services/messages-api"
import { normalizeTokenEvent } from "@/utils/ao-event-utils"

import { TokenBalancesTableRow } from "./TokenBalancesTableRow"

type TokenBalancesProps = {
  entityId: string
  open: boolean
}

export function TokenBalances(props: TokenBalancesProps) {
  const { entityId, open } = props

  const pageSize = 1000
  const [data, setData] = useState<string[]>([])

  useEffect(() => {
    getTokenTransfers(pageSize, undefined, entityId).then((events) => {
      const parsed = events.map(normalizeTokenEvent)
      let uniqueTokenIds = new Set<string>()
      parsed.forEach((event) => {
        uniqueTokenIds.add(event.tokenId)
      })
      const tokenIds = Array.from(uniqueTokenIds)
      setData(tokenIds)
    })
  }, [entityId])

  if (!open) return null

  return (
    <Paper>
      <InMemoryTable
        initialSortField="tokenId"
        initialSortDir="asc"
        data={data}
        headerCells={[
          { field: "tokenId", label: "Token name" },
          {
            label: "Balance",
            align: "right",
          },
          { label: "Ticker", sx: { width: 220 } },
        ]}
        renderRow={(tokenId) => (
          <TokenBalancesTableRow
            key={tokenId}
            tokenId={tokenId}
            entityId={entityId}
          />
        )}
      />
    </Paper>
  )
}
