import React from "react"
import { Box, Typography, CircularProgress } from "@mui/material"

import { ArDomainsTable } from "./ArDomainsTable"
import { useArnsRecordsByOwner } from "@/hooks/useArnsRecordsByOwner"

type ArDomainsProps = {
  entityId: string
  open: boolean
}

function BaseArDomains(props: ArDomainsProps) {
  const { entityId, open } = props

  if (!open) return null

  const { data: arnsRecords, isLoading, error } = useArnsRecordsByOwner(entityId)

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">
          Error loading ArNS records: {error instanceof Error ? error.message : 'Unknown error'}
        </Typography>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    )
  }

  if (!arnsRecords || arnsRecords.length === 0) {
    return (
      <Box p={3}>
        <Typography color="text.secondary">
          No ArNS names owned by this entity.
        </Typography>
      </Box>
    )
  }

  return (
    <ArDomainsTable
      records={arnsRecords}
      loading={isLoading}
    />
  )
}

export const ArDomains = React.memo(BaseArDomains)
