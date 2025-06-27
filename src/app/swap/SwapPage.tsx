import React, { Fragment } from "react"
import PageWrapper from "@/components/PageWrapper"
import { Avatar, Box, Divider, Skeleton, Stack, Typography } from "@mui/material"
import { Wallet, ArrowUpRight, ArrowDownLeft } from "@phosphor-icons/react"
import { useParams } from "react-router-dom"

import { EntityBlock } from "@/components/EntityBlock"
import { MessageTreeGraph } from "@/components/MessageTreeGraph"
import { useSwap } from "@/hooks/useSwap"
import { Transfer } from "@/services/swap"

interface SwapTransferProps {
  t: Transfer
}

function SwapTransfer({ t }: SwapTransferProps) {
  const amount = (Number(t.amount) / 10 ** (t.tokenInfo?.denomination ?? 1)).toLocaleString(
    "en-US",
    { maximumFractionDigits: 6 },
  )

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      p={1}
      sx={{ background: "white", borderRadius: "8px" }}
    >
      <Box p={0.5} sx={{ background: "#8888883C", borderRadius: "8px" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Wallet size={28} color="#888888" />
          <Box display="flex" gap={0.5} alignItems="center">
            <EntityBlock entityId={t.from} />
            <Typography variant="caption">({t.timestamp?.toLocaleString() ?? ""})</Typography>
          </Box>
        </Box>
        <Divider orientation="horizontal" />
        <Box ml={4} mt={0.5} display="flex" gap={0.6}>
          <Box display="flex" alignItems="center">
            <ArrowUpRight size={18} color="red" />
          </Box>
          <Typography variant="body1">Token Sent</Typography>
          <Typography variant="body1">{amount}</Typography>
          <Box display="flex" alignItems="center">
            <Avatar
              src={`https://arweave.net/${t.tokenInfo?.logo ?? ""}`}
              alt={t.tokenInfo?.name ?? "token-logo"}
              sx={{ width: 20, height: 20 }}
            />
          </Box>
        </Box>
      </Box>
      <Box p={0.5} sx={{ background: "#8888883C", borderRadius: "8px" }}>
        <Box display="flex" gap={1}>
          <Wallet size={28} color="#888888" />
          <EntityBlock entityId={t.to} />
        </Box>
        <Divider orientation="horizontal" />
        <Box ml={4} mt={0.5} display="flex" gap={0.6}>
          <Box display="flex" alignItems="center">
            <ArrowDownLeft size={18} color="green" />
          </Box>
          <Typography variant="body1">Token Received</Typography>
          <Typography variant="body1">{amount}</Typography>
          <Box display="flex" alignItems="center">
            <Avatar
              src={`https://arweave.net/${t.tokenInfo?.logo ?? ""}`}
              alt={t.tokenInfo?.name ?? "token-logo"}
              sx={{ width: 20, height: 20 }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function SwapPageContent() {
  const { messageId = "" } = useParams()
  const { swap, isLoading } = useSwap(messageId)

  return (
    <Fragment>
      <Stack component="main" gap={6} paddingY={4}>
        <Box width="100%">
          <Typography variant="h6">Swap messages tree:</Typography>
          {isLoading ? (
            <Skeleton width="100%" height={600} />
          ) : swap?.tree ? (
            <MessageTreeGraph
              data={swap?.tree}
              label={(d) => `${d.action ? `${d.action}` : ""}`}
              r={5}
              height={600}
              padding={2}
              strokeWidth={3}
              highlightPath={["Transfer", "Credit-Notice", "Transfer", "Credit-Notice"]}
              link={(d) => `https://www.ao.link/#/message/${d.id}`}
            />
          ) : (
            <Typography variant="subtitle2">Swap not found</Typography>
          )}
        </Box>
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Typography variant="h6">Swap summary:</Typography>
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            p={1}
            borderRadius={12}
            border="1px solid #AABBCC"
            sx={{ background: "#8888883C", borderRadius: "8px" }}
          >
            {swap?.transfers.map((t, i) => <SwapTransfer t={t} key={`transfer-${i}`} />)}
          </Box>
        </Box>
      </Stack>
    </Fragment>
  )
}

export function SwapPage() {
  return (
    <PageWrapper>
      <SwapPageContent />
    </PageWrapper>
  )
}
