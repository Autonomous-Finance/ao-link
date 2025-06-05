import { Skeleton, Typography } from "@mui/material"
import React from "react"

import { SectionInfo } from "./SectionInfo"
import { usePrimaryArnsName } from "@/hooks/usePrimaryArnsName"

type ArnsSectionProps = {
  entityId: string
}

export function ArnsSection(props: ArnsSectionProps) {
  const { entityId } = props

  const { data: arnsName, isLoading } = usePrimaryArnsName(entityId)

  return (
    <SectionInfo
      title="Primary ArNS Name"
      value={
        isLoading ? (
          <Skeleton width={100} />
        ) : arnsName ? (
          `${arnsName}`
        ) : (
          <Typography color="text.secondary" variant="inherit">
            None
          </Typography>
        )
      }
    />
  )
}
