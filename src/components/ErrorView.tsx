import { Alert, AlertTitle, Button, Stack } from "@mui/material"
import React from "react"

interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorView({ message = "Something went wrong.", onRetry }: Props) {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
      <Alert severity="error" sx={{ maxWidth: 480, width: "100%" }}>
        <AlertTitle>Error</AlertTitle>
        {message}
        {onRetry && (
          <Button size="small" sx={{ mt: 2 }} variant="outlined" onClick={onRetry}>
            Retry
          </Button>
        )}
      </Alert>
    </Stack>
  )
} 