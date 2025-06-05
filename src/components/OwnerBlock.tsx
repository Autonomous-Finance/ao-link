import { Box, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"

import { EntityBlock } from "./EntityBlock"
import { MainFontFF } from "./RootLayout/fonts"
import { usePrimaryArnsName } from "@/hooks/usePrimaryArnsName"
import { useArnsLogo } from "@/hooks/useArnsLogo"

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
  const { data: logoTxId } = useArnsLogo(primaryName || "")

  const handleArnsClick = () => {
    navigate(`/entity/${ownerId}`)
  }

  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <EntityBlock entityId={ownerId} />
      {primaryName && (
        <Stack 
          direction="row" 
          alignItems="center" 
          gap={0.5}
          onClick={handleArnsClick}
          sx={{
            cursor: "pointer",
            color: "#1976d2",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {logoTxId && (
            <Box
              component="img"
              src={`https://arweave.net/${logoTxId}`}
              alt={`${primaryName} logo`}
              sx={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          )}
          <span style={{ 
            fontFamily: "monospace",
            fontSize: "0.875rem",
            color: "inherit"
          }}>
            {primaryName}
          </span>
        </Stack>
      )}
    </Stack>
  )
}