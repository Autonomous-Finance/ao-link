import React, { Suspense, lazy, useState } from "react"
import { Box, CircularProgress, Tabs } from "@mui/material"
import { TabWithCount } from "@/components/TabWithCount"
import { AoMessage } from "@/types"
import { CombinedMessagesTable } from "./CombinedMessagesTable"
import { MessageData } from "./MessageData"
import { ComputeResult } from "./ComputeResult"
import { TagsSection } from "@/components/TagsSection"

const GraphTab = lazy(() => import("@/components/Graph").then((m) => ({ default: m.Graph })))

interface Props {
  message: AoMessage
  pushedFor?: string
  computeResult: any
  totalCount?: number
  onCount: (total: number | undefined) => void
  onGraphData: (data: AoMessage[]) => void
}

export default function TransactionDetailsTabs(props: Props) {
  const {
    message,
    pushedFor,
    computeResult,
    totalCount,
    onCount,
    onGraphData,
  } = props

  const [tab, setTab] = useState("messages")
  const [localCount, setLocalCount] = useState<number>()

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        <TabWithCount value="messages" label="Messages" chipValue={localCount} />
        <TabWithCount value="details" label="Details" />
        <TabWithCount value="graph" label="Graph" />
      </Tabs>

      {tab === "messages" && (
        <CombinedMessagesTable
          message={message}
          computeResult={computeResult}
          pageSize={50}
          onCountReady={(c) => {
            setLocalCount(c)
            onCount(c)
          }}
          onDataReady={onGraphData}
        />
      )}

      {tab === "details" && (
        <Box sx={{ mt: 2 }}>
          <TagsSection label="Tags" tags={message.userTags} />
          <TagsSection label="System Tags" tags={message.systemTags} />
          <ComputeResult
            messageId={message.id}
            processId={message.to}
            autoCompute
            onComputedResult={() => null}
          />
          <MessageData message={message} />
        </Box>
      )}

      {tab === "graph" && (
        <Suspense
          fallback={
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          }
        >
          <GraphTab data={[]} />
        </Suspense>
      )}
    </Box>
  )
} 