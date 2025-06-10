import { Fade, Stack, Tooltip } from "@mui/material"
import { DiamondsFour } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import React, { useMemo } from "react"

import { IdBlock } from "./IdBlock"
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

  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {message?.type === "Process" && (
        <Fade in>
          <Tooltip title="Process">
            <DiamondsFour height={16} width={16} />
          </Tooltip>
        </Fade>
      )}
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
    </Stack>
  )
}
