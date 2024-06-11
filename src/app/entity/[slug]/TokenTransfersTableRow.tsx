import { TableCell, TableRow, Tooltip, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import { EntityBlock } from "@/components/EntityBlock"
import { IdBlock } from "@/components/IdBlock"
import { InOutLabel } from "@/components/InOutLabel"
import { TokenAmountBlock } from "@/components/TokenAmountBlock"
import { TokenBlock } from "@/components/TokenBlock"
import { TypeBadge } from "@/components/TypeBadge"
import { TokenInfo, getTokenInfo } from "@/services/token-api"
import { TokenTransferMessage } from "@/types"
import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { nativeTokenInfo } from "@/utils/native-token"

type TokenTransfersTableRowProps = {
  item: TokenTransferMessage
  entityId: string
}

export function TokenTransfersTableRow(props: TokenTransfersTableRowProps) {
  const navigate = useNavigate()

  const { item, entityId } = props

  const { tokenId } = item

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>(undefined)
  useEffect(() => {
    if (tokenId === nativeTokenInfo.processId) {
      setTokenInfo(nativeTokenInfo)
    } else {
      getTokenInfo(tokenId).then(setTokenInfo)
    }
  }, [tokenId])

  return (
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
      {/* <TableCell>{item.action}</TableCell> */}
      <TableCell>
        <IdBlock label={truncateId(item.id)} value={item.id} href={`/message/${item.id}`} />
      </TableCell>
      <TableCell>
        <EntityBlock entityId={item.sender} />
      </TableCell>
      <TableCell>
        <InOutLabel outbound={entityId === item.sender} />
      </TableCell>
      <TableCell>
        <EntityBlock entityId={item.recipient} />
      </TableCell>
      <TableCell align="right">
        <Typography
          component="div"
          variant="inherit"
          sx={{
            color: item.amount > 0 ? "success.main" : "error.main",
          }}
        >
          <TokenAmountBlock amount={item.amount} tokenInfo={tokenInfo} needsParsing />
        </Typography>
      </TableCell>
      <TableCell>
        <TokenBlock tokenId={tokenId} tokenInfo={tokenInfo} />
      </TableCell>
      <TableCell align="right">
        <Tooltip title={formatFullDate(item.created)}>
          <span>{formatRelative(item.created)}</span>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
