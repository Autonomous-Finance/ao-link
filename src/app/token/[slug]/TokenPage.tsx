import {
  Avatar,
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { ArrowSquareOut } from "@phosphor-icons/react"
import React, { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import PageWrapper from "@/components/PageWrapper"

import { TokenHolderChart } from "./TokenHolderChart"
import { TokenHolderTable } from "./TokenHolderTable"
import { IdBlock } from "@/components/IdBlock"
import PageSkeleton from "@/components/PageSkeleton"
import ErrorView from "@/components/ErrorView"
import { SectionInfo } from "@/components/SectionInfo"
import { Subheading } from "@/components/Subheading"
import { TokenAmountBlock } from "@/components/TokenAmountBlock"
import { useTokenInfo } from "@/hooks/useTokenInfo"
import { TokenHolder, getTokenHolders } from "@/services/token-api"
import { isArweaveId } from "@/utils/utils"

const defaultTab = "table"

export default function TokenPage() {
  const { tokenId } = useParams()

  const tokenInfo = useTokenInfo(tokenId)

  const [tokenHolders, setTokenHolders] = useState<TokenHolder[]>()

  useEffect(() => {
    if (!tokenInfo) return

    getTokenHolders(tokenInfo).then(setTokenHolders)
  }, [tokenInfo])

  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || defaultTab)
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
    if (newValue === defaultTab) {
      setSearchParams({})
    } else {
      setSearchParams({ tab: newValue })
    }
  }

  const errorMessage = useMemo(() => {
    if (!isArweaveId(String(tokenId))) {
      return "Invalid Process ID."
    }
    if (tokenInfo === null) {
      return "Cannot read Token Info."
    }
  }, [tokenId, tokenInfo])

  if (!tokenId || tokenInfo === null || errorMessage) {
    return <ErrorView message={errorMessage || "Invalid token"} />
  }

  return (
    <PageWrapper>
      <Stack component="main" gap={6} paddingY={4} key={tokenId}>
        <Subheading type="TOKEN" value={<IdBlock label={tokenId} />} />
        <Grid2 container spacing={{ xs: 4 }}>
          <Grid2 xs={12} lg={6}>
            {tokenInfo === undefined ? (
              <Skeleton height={48} variant="rectangular" />
            ) : (
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
            )}
          </Grid2>
          <Grid2 xs={12} lg={6}>
            {tokenHolders === undefined ? (
              <Skeleton height={48} variant="rectangular" />
            ) : (
              <Stack justifyContent="center" height="100%">
                <SectionInfo title="Token holders" value={tokenHolders.length} />
                <SectionInfo
                  title="Circulating supply"
                  value={
                    <TokenAmountBlock
                      amount={tokenHolders.reduce((acc, holder) => acc + holder.balance, 0)}
                      tokenInfo={tokenInfo}
                    />
                  }
                />
              </Stack>
            )}
          </Grid2>
        </Grid2>
        <div>
          <Tabs value={activeTab} onChange={handleChange} textColor="primary">
            <Tab value="table" label="Token Holders Table" />
            <Tab value="chart" label="Token Holders Chart" />
            <Button
              href={`https://dexi.defi.ao/#/token/${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                gap: 0.5,
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                fontSize: "0.875rem",
                textTransform: "none",
                color: "var(--mui-palette-text-secondary)",
              }}
              color="secondary"
            >
              View on Dexi
              <ArrowSquareOut />
            </Button>
          </Tabs>
          <Box sx={{ marginX: -2 }}>
            {tokenHolders === undefined || !tokenInfo ? (
              <PageSkeleton />
            ) : (
              <Paper>
                {activeTab === "table" && (
                  <TokenHolderTable data={tokenHolders} tokenInfo={tokenInfo} />
                )}
                {activeTab === "chart" && (
                  <TokenHolderChart data={tokenHolders} tokenInfo={tokenInfo} />
                )}
              </Paper>
            )}
          </Box>
        </div>
      </Stack>
    </PageWrapper>
  )
}
