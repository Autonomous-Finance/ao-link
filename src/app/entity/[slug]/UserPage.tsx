"use client"
import { Box, Stack, Tab, Tabs } from "@mui/material"
import React, { useState } from "react"

import { BalanceSection } from "@/components/BalanceSection"
import { IdBlock } from "@/components/IdBlock"
import { Subheading } from "@/components/Subheading"

import { TabWithCount } from "@/components/TabWithCount"

import { IncomingMessagesTable } from "./IncomingMessagesTable"
import { OutgoingMessagesTable } from "./OutgoingMessagesTable"
import { TokenBalances } from "./TokenBalances"
import { TokenTransfers } from "./TokenTransfers"

type UserPageProps = {
  entityId: string
}

export function UserPage(props: UserPageProps) {
  const { entityId } = props

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [outgoingCount, setOutgoingCount] = useState<number>()
  const [incomingCount, setIncomingCount] = useState<number>()

  return (
    <Stack component="main" gap={6} paddingY={4}>
      <Subheading type="USER" value={<IdBlock label={entityId} />} />
      <BalanceSection entityId={entityId} />
      <div>
        <Tabs value={activeTab} onChange={handleChange} textColor="primary">
          <TabWithCount
            value={0}
            label="Outgoing messages"
            chipValue={outgoingCount}
          />
          <TabWithCount
            value={1}
            label="Incoming messages"
            chipValue={incomingCount}
          />
          <Tab value={2} label="Token transfers" />
          <Tab value={3} label="Token balances" />
        </Tabs>
        <Box sx={{ marginX: -2 }}>
          <OutgoingMessagesTable
            entityId={entityId}
            open={activeTab === 0}
            onCountReady={setOutgoingCount}
          />
          <IncomingMessagesTable
            entityId={entityId}
            open={activeTab === 1}
            onCountReady={setIncomingCount}
          />
          <TokenTransfers entityId={entityId} open={activeTab === 2} />
          <TokenBalances entityId={entityId} open={activeTab === 3} />
        </Box>
      </div>
    </Stack>
  )
}
