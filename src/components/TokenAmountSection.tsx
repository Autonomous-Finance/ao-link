import { Avatar, Skeleton, Stack } from "@mui/material"
import React from "react"

import { truncateId } from "@/utils/data-utils"
import { nativeTokenInfo } from "@/utils/native-token"

import { IdBlock } from "./IdBlock"
import { RetryableBalance } from "./RetryableBalance"
import { SectionInfo } from "./SectionInfo"
import { TokenAmountBlock } from "./TokenAmountBlock"
import { TokenInfo } from "@/services/token-api"

type TokenAmountSectionProps = {
  amount: string
  tokenInfo: TokenInfo | null | undefined
  label: string
  loading?: boolean
}

export function TokenAmountSection(props: TokenAmountSectionProps) {
  const { amount, label, tokenInfo, loading } = props

  const tokenId = tokenInfo?.processId ?? ""

  return (
    <SectionInfo
      title={label}
      value={
        <Stack direction="row" gap={1} alignItems="center">
          {!loading ? (
            <TokenAmountBlock amount={amount} tokenInfo={tokenInfo} needsParsing />
          ) : (
            <Skeleton width={50} sx={{ display: "inline-flex" }} height={22} />
          )}
          {tokenInfo && (
            <Avatar
              src={`https://arweave.net/${tokenInfo.logo}`}
              alt={tokenInfo.name}
              sx={{ width: 16, height: 16 }}
            />
          )}
          <IdBlock
            label={tokenInfo?.ticker || truncateId(tokenId)}
            value={tokenId}
            href={`/token/${tokenId}`}
          />
        </Stack>
      }
    />
  )
}
