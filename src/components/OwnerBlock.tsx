import { Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"

import { ArNSNameDisplay } from "./ArNSNameChip"
import { EntityBlock } from "./EntityBlock"
import { usePrimaryArnsName } from "@/hooks/usePrimaryArnsName"

type OwnerBlockProps = {
  ownerId: string
}

/**
 * Component for displaying entity owner with optional primary ArNS name
 * Shows the EntityBlock and if the owner has a primary ArNS name, displays it with a globe icon
 */
export function OwnerBlock(props: OwnerBlockProps) {
  const { ownerId } = props
  const navigate = useNavigate()
  
  const { data: primaryName, isLoading } = usePrimaryArnsName(ownerId)

  const handleArnsClick = () => {
    navigate(`/entity/${ownerId}`)
  }

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <EntityBlock entityId={ownerId} />
      {primaryName && (
        <ArNSNameDisplay
          name={primaryName}
          onClick={handleArnsClick}
          inline
        />
      )}
    </Stack>
  )
}