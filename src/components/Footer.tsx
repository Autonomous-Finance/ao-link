import { Container, Link, Stack, Typography } from "@mui/material"
import React from "react"

export function Footer() {
  return (
    <>
      <Container maxWidth="xl" sx={{ paddingX: 2, paddingY: 4 }}>
        <Stack justifyContent="space-between" direction="row">
          <Link
            href="https://6t4x4xx75j3ovjugzicw7wx7bogigt4sz3pnbh43dqdua6pa56wa.arweave.net/9Pl-Xv_qduqmhsoFb9r_C4yDT5LO3tCfmxwHQHng76w/#/spec"
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              "&:hover": {
                color: "text.primary",
              },
            }}
            fontWeight={500}
            underline="none"
            variant="body2"
          >
            SPEC
          </Link>
          <Typography variant="caption">
            © 2023{" "}
            <Link href="https://dataos.so" color="text.primary">
              DataOS
            </Link>{" "}
            Technologies. All rights reserved
          </Typography>
        </Stack>
      </Container>
    </>
  )
}
