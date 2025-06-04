import { Fade, Stack, Tooltip } from "@mui/material"
import { DiamondsFour } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import React, { useMemo } from "react"

import { ArNSNameDisplay } from "./ArNSNameChip"
import { IdBlock } from "./IdBlock"
import { useArnsNameForAddress } from "@/hooks/useArnsNameForAddress"
import { getMessageById } from "@/services/messages-api"
import { truncateId } from "@/utils/data-utils"

type EntityBlockProps = { entityId: string; fullId?: boolean; skipQuery?: boolean }

export function EntityBlock(props: EntityBlockProps) {
  const { entityId, fullId, skipQuery } = props

  const { data: message } = useQuery({
    queryKey: ["message", entityId],
    enabled: !skipQuery,
    queryFn: () => getMessageById(entityId),
  })

  const entityName = useMemo(() => {
    return message?.tags["Name"]
  }, [message])

  const { data: primaryArnsName } = useArnsNameForAddress(entityId)

  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {message?.type === "Process" && (
        <Fade in>
          <Tooltip title="Process">
            <DiamondsFour height={16} width={16} />
          </Tooltip>
        </Fade>
      )}
      <Stack direction="row" gap={1} alignItems="center">
        <IdBlock
          label={
            entityName
              ? entityName
              : fullId
                ? entityId
                : truncateId(entityId)
          }
          value={entityId}
          href={`/entity/${entityId}`}
        />
        
        {/* Show primary ArNS name if available */}
        {primaryArnsName && (
          <ArNSNameDisplay
            name={primaryArnsName}
            onClick={() => window.open(`https://${primaryArnsName}.ar.io`, '_blank')}
          />
        )}
      </Stack>
    </Stack>
  )
}
