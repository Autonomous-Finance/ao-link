import { Paper, Stack, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"

import { FormattedDataBlock } from "@/components/FormattedDataBlock"
import { AoMessage } from "@/types"

export function MessageData(props: { message: AoMessage }) {
  const { message } = props

  const [data, setData] = useState<string>("")

  useEffect(() => {
    if (!message) return

    if (message.type === "Checkpoint") {
      setData("Message too long")
    } else {
      fetch(`https://arweave.net/${message.id}`)
        .then((res) => res.text())
        .then(setData)
    }
  }, [message])

  return (
    <Stack gap={1} justifyContent="stretch">
      <Typography variant="subtitle2" color="text.secondary">
        Data
      </Typography>
      <FormattedDataBlock data={data} isEvalMessage={message.action === "Eval"} component={Paper} />
    </Stack>
  )
}
