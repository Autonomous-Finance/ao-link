import { Avatar, Box, Divider, Skeleton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Wallet, ArrowUpRight, ArrowDownLeft } from "@phosphor-icons/react"
import { Fragment } from "react"
import { useParams } from "react-router-dom"

import { EntityBlock } from "@/components/EntityBlock"
import { MessageTreeGraph } from "@/components/MessageTreeGraph"
import { useSwap } from "@/hooks/useSwap"
import { Transfer } from "@/services/swap"

interface SwapTransferProps {
  t: Transfer
}

function SwapTransfer({ t }: SwapTransferProps) {
  // const [isRepushing, setIsRepushing] = useState(false)

  const amount = (Number(t.amount) / 10 ** (t.tokenInfo?.denomination ?? 1)).toLocaleString(
    "en-US",
    { maximumFractionDigits: 6 },
  )

  // const repushMessage = async () => {
  //   if (isRepushing) return

  //   setIsRepushing(true)

  //   try {
  //     await fetch(`https://mu6.ao-testnet.xyz/push/${t.message.id}/3?process-id=${t.process}`, {
  //       method: "POST",
  //     })
  //   } catch (err) {
  //     console.error("Failed to repush", err)
  //   }

  //   setIsRepushing(false)
  // }

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
          {/* {t.repushable && (
            <Button variant="outlined" size="small" onClick={repushMessage} disabled={isRepushing}>
              Repush
            </Button>
          )} */}
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

export function SwapPage() {
  const { messageId = "" } = useParams()
  const { swap, isLoading } = useSwap(messageId)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const graphHeight = isMobile ? 300 : 600

  return (
    <Fragment>
      <Stack component="main" gap={6} paddingY={4}>
        <Box width="100%">
          <Typography variant="h6">Swap messages tree:</Typography>
          {isLoading ? (
            <Skeleton width="100%" sx={{ height: graphHeight }} />
          ) : swap?.tree ? (
            <MessageTreeGraph
              data={swap?.tree}
              label={(d) => `${d.action ? `${d.action}` : ""}`}
              r={5}
              height={graphHeight}
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
