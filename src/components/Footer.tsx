import { Box, Button, Container, Link, Stack, Typography } from "@mui/material"
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
          <Stack
            direction="row"
            sx={{ color: "#D4D5D9" }}
            gap={1.5}
            alignItems="center"
          >
            <Link
              href="/"
              sx={{
                "&:hover": {
                  color: "#FFF",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              HOME
            </Link>
            <Typography
              component="span"
              sx={{ opacity: 0.4 }}
              variant="caption"
            >
              /
            </Typography>
            <Link
              href="https://gygbo2cdld7i3t624il5zxa3ezyv6sa2ikvhrlmabah2etw45wua.arweave.net/NgwXaENY_o3P2uIX3NwbJnFfSBpCqnitgAgPok7c7ag/#/spec"
              target="_blank"
              sx={{
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
            <Typography
              component="span"
              sx={{ opacity: 0.4 }}
              variant="caption"
            >
              /
            </Typography>
            <Link
              href="https://github.com/permaweb/aos"
              target="_blank"
              sx={{
                "&:hover": {
                  color: "#FFF",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              GITHUB
            </Link>
            <Typography
              component="span"
              sx={{ opacity: 0.4 }}
              variant="caption"
            >
              /
            </Typography>
            <Link
              href="http://arweave.net/9Pl-Xv_qduqmhsoFb9r_C4yDT5LO3tCfmxwHQHng76w/"
              target="_blank"
              sx={{
                "&:hover": {
                  color: "#FFF",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              AO
            </Link>
            <Typography
              component="span"
              sx={{ opacity: 0.4 }}
              variant="caption"
            >
              /
            </Typography>
            <Link
              href="https://twitter.com/TheDataOS"
              target="_blank"
              sx={{
                "&:hover": {
                  color: "#FFF",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              X
            </Link>
            <Typography
              component="span"
              sx={{ opacity: 0.4 }}
              variant="caption"
            >
              /
            </Typography>
            <Link
              href="https://stats.dataos.so/"
              target="_blank"
              sx={{
                "&:hover": {
                  color: "#FFF",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              ARWEAVE STATS
            </Link>
          </Stack>
          <Button
            component={Link}
            target="_blank"
            href="https://dataos.so/"
            sx={{ margin: -1 }}
          >
            <PoweredBy />
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
