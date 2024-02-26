import { Box, Container, Link, Stack } from "@mui/material"
import React from "react"

import { PoweredBy } from "./PoweredBy"

export function Footer() {
  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        width: "100%",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          paddingX: 2,
          paddingY: 1,
          background: "#242629",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Stack justifyContent="space-between" direction="row">
          <Link
            href="https://6t4x4xx75j3ovjugzicw7wx7bogigt4sz3pnbh43dqdua6pa56wa.arweave.net/9Pl-Xv_qduqmhsoFb9r_C4yDT5LO3tCfmxwHQHng76w/#/spec"
            // color="text.secondary"
            sx={{
              textTransform: "uppercase",
              color: "#D4D5D9",
              "&:hover": {
                color: "#FFF",
              },
            }}
            fontWeight={500}
            underline="none"
            variant="body2"
          >
            SPEC
          </Link>
          <PoweredBy />
        </Stack>
      </Container>
    </Box>
  )
}
