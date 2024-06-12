"use client"

import { Box, Stack, Tabs } from "@mui/material"

import { useState } from "react"

import { useParams } from "react-router-dom"

import { BlockMessagesTable } from "./BlockMessagesTable"
import { IdBlock } from "@/components/IdBlock"
import { Subheading } from "@/components/Subheading"

import { TabWithCount } from "@/components/TabWithCount"

import { formatNumber } from "@/utils/number-utils"

export default function BlockPage() {
  const params = useParams()
  const blockHeight = params.blockHeight ? parseInt(params.blockHeight) : 0

  const [activeTab, setActiveTab] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const [messagesCount, setMessagesCount] = useState<number>()

  return (
    <Stack component="main" gap={4} paddingY={4} key={blockHeight}>
      <Subheading
        type="Block"
        value={<IdBlock label={formatNumber(blockHeight)} value={params.blockHeight} />}
      />
      <div>
        <Tabs value={activeTab} onChange={handleChange} textColor="primary">
          <TabWithCount value={0} label="Messages" chipValue={messagesCount} />
        </Tabs>
        <Box sx={{ marginX: -2 }}>
          <BlockMessagesTable open blockHeight={blockHeight} onCountReady={setMessagesCount} />
        </Box>
      </div>
    </Stack>
  )
}
