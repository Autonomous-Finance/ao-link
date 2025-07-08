import { Box, Container, Link, Stack, Typography } from "@mui/material"
import React from "react"

import { AutonomousFinanceLogo } from "./AutonomousFinanceLogo"
import { GoldSkyLogo } from "./GoldSkyLogo"

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
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            overflowX: { xs: "auto", md: "visible" },
            whiteSpace: { xs: "nowrap", md: "normal" },
            width: "100%",
            justifyContent: { xs: "flex-start", md: "space-between" },
          }}
        >
          <Stack direction="row" gap={1.5} alignItems="center" sx={{ color: "#D4D5D9" }}>
            <Link
              href="/"
              sx={{
                color: "rgb(180, 180, 180)",
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
            <Typography component="span" sx={{ opacity: 0.4 }} variant="caption">
              /
            </Typography>
            <Link
              href="https://ao.defi.ao"
              target="_blank"
              sx={{
                color: "rgb(180, 180, 180)",
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
            <Typography component="span" sx={{ opacity: 0.4 }} variant="caption">
              /
            </Typography>
            <Link
              href="https://gygbo2cdld7i3t624il5zxa3ezyv6sa2ikvhrlmabah2etw45wua.arweave.net/NgwXaENY_o3P2uIX3NwbJnFfSBpCqnitgAgPok7c7ag/#/spec"
              target="_blank"
              sx={{
                color: "rgb(180, 180, 180)",
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
            <Typography component="span" sx={{ opacity: 0.4 }} variant="caption">
              /
            </Typography>
            <Link
              href="https://github.com/Autonomous-Finance"
              target="_blank"
              sx={{
                color: "rgb(180, 180, 180)",
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
            <Typography component="span" sx={{ opacity: 0.4 }} variant="caption">
              /
            </Typography>
            <Link
              href="https://x.com/autonomous_af"
              target="_blank"
              sx={{
                color: "rgb(180, 180, 180)",
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
            <Typography component="span" sx={{ opacity: 0.4 }} variant="caption">
              /
            </Typography>
            <Link
              href="https://stats.dataos.so/"
              target="_blank"
              sx={{
                color: "rgb(180, 180, 180)",
                "&:hover": {
                  color: "#FFF",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              ARWEAVE STATS
            </Link>{" "}
            <Typography component="span" sx={{ opacity: 0.4 }} variant="caption">
              /
            </Typography>
            <Link
              href="https://docs.autonomous.finance/products/ecosystem-tooling/ao-link"
              target="_blank"
              sx={{
                color: "rgb(180, 180, 180)",
                "&:hover": {
                  color: "#FFF",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              DOCS
            </Link>
          </Stack>
          {/* Spacer for mobile */}
          <Box sx={{ display: { xs: 'inline-block', md: 'none' }, minWidth: 32 }} />
          <Stack direction="row" gap={1} alignItems="center">
            <Typography component="span" sx={{ color: "rgb(180, 180, 180)" }} variant="caption">
              Powered by
            </Typography>
            <Link
              href="https://autonomous.finance"
              target="_blank"
              sx={{
                color: "rgb(180, 180, 180)",
                "&:hover": {
                  color: "#FFF",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              <AutonomousFinanceLogo />
            </Link>
            <Link
              href="https://goldsky.com"
              target="_blank"
              sx={{
                color: "rgb(180, 180, 180)",
                "&:hover": {
                  color: "#FFF",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              <GoldSkyLogo />
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}