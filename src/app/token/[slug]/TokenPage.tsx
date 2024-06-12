"use client"

import { Avatar, Paper, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import React, { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import { TokenHolderChart } from "./TokenHolderChart"
import { TokenHolderTable } from "./TokenHolderTable"
import { IdBlock } from "@/components/IdBlock"
import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { SectionInfo } from "@/components/SectionInfo"
import { Subheading } from "@/components/Subheading"
import { TokenAmountBlock } from "@/components/TokenAmountBlock"
import { useTokenInfo } from "@/hooks/useTokenInfo"
import { TokenHolder, getTokenHolders } from "@/services/token-api"

export default function TokenPage() {
  const { tokenId } = useParams()

  const tokenInfo = useTokenInfo(tokenId)

  const [tokenHolders, setTokenHolders] = useState<TokenHolder[] | null>(null)

  useEffect(() => {
    if (!tokenInfo) return

    getTokenHolders(tokenInfo).then(setTokenHolders)
  }, [tokenInfo])

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  if (!tokenInfo) {
    return <>Not a valid token</>
  }

  if (tokenHolders === null) {
    return <LoadingSkeletons />
  }

  const circulatingSupply = tokenHolders.reduce((acc, holder) => acc + holder.balance, 0)

  return (
    <Stack component="main" gap={6} paddingY={4} key={tokenId}>
      <Subheading type="TOKEN" value={<IdBlock label={tokenInfo.processId} />} />
      <Grid2 container spacing={{ xs: 4 }}>
        <Grid2 xs={12} lg={6}>
          <Stack direction="row" gap={1} alignItems="center">
            <Avatar
              src={`https://arweave.net/${tokenInfo.logo}`}
              alt={tokenInfo.name}
              sx={{ width: 48, height: 48 }}
            />
            <Stack>
              <Tooltip title="Name" placement="right">
                <Typography variant="h6" lineHeight={1.15}>
                  {tokenInfo.name}
                </Typography>
              </Tooltip>
              <Tooltip title="Ticker" placement="right">
                <Typography variant="body2" lineHeight={1.15} color="text.secondary">
                  {tokenInfo.ticker}
                </Typography>
              </Tooltip>
            </Stack>
          </Stack>
        </Grid2>
        <Grid2 xs={12} lg={6}>
          <Stack justifyContent="center" height="100%">
            <SectionInfo title="Token holders" value={tokenHolders.length} />
            <SectionInfo
              title="Circulating supply"
              value={<TokenAmountBlock amount={circulatingSupply} tokenInfo={tokenInfo} />}
            />
          </Stack>
        </Grid2>
      </Grid2>
      <div>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          textColor="primary"
          // indicatorColor="secondary"
        >
          <Tab value={0} label="Token Holders Table" />
          <Tab value={1} label="Token Holders Chart" />
        </Tabs>
        <Paper sx={{ marginX: -2 }}>
          {activeTab === 0 && <TokenHolderTable data={tokenHolders} tokenInfo={tokenInfo} />}
          {activeTab === 1 && <TokenHolderChart data={tokenHolders} tokenInfo={tokenInfo} />}
        </Paper>
      </div>
    </Stack>
  )
}
