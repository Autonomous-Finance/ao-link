import React, { useMemo } from "react"
import { Stack, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"
import PageWrapper from "@/components/PageWrapper"
import { getMessageById } from "@/services/messages-api"

import { ProcessPage } from "./ProcessPage"
import { UserPage } from "./UserPage"
import { LoadingSkeletons } from "@/components/LoadingSkeletons"

import { AoProcess } from "@/types"
import { isArweaveId } from "@/utils/utils"

function EntityPageContent() {
  const { entityId = "" } = useParams()

  const isValidId = useMemo(() => isArweaveId(String(entityId)), [entityId])

  const {
    data: message,
    isLoading,
    error,
  } = useQuery({
    enabled: Boolean(entityId) && isValidId,
    queryKey: ["message", entityId],
    queryFn: () => getMessageById(entityId),
  })

  if (!isValidId || error) {
    return (
      <Stack component="main" gap={4} paddingY={4}>
        <Typography>{error?.message || "Invalid Entity ID."}</Typography>
      </Stack>
    )
  }

  if (isLoading) {
    return <LoadingSkeletons />
  }

  if (!message) {
    return <UserPage key={entityId} entityId={entityId} />
  }

  if (message.type === "Process") {
    return <ProcessPage key={entityId} message={message as AoProcess} />
  }

  return <Navigate to={`/message/${entityId}`} />
}

export default function EntityPage() {
  return (
    <PageWrapper>
      <EntityPageContent />
    </PageWrapper>
  )
}
