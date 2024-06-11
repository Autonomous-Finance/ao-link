"use client"

import {
  AppBar,
  Container,
  IconButton,
  Stack,
  Button,
  Toolbar,
  useColorScheme,
  Link as MuiLink,
  useScrollTrigger,
  Box,
} from "@mui/material"
import { Moon, Sun } from "@phosphor-icons/react"
import { ConnectButton } from "arweave-wallet-kit"

import { Link } from "react-router-dom"

import SearchBar from "@/app/SearchBar"

import { Logo } from "./Logo"
import { MainFontFF } from "./RootLayout/fonts"

const Header = () => {
  const { mode = "dark", setMode } = useColorScheme()

  const elevated = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: typeof window !== "undefined" ? window : undefined,
  })

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        border: 0,
        borderBottom: "1px solid transparent",
        ...(elevated
          ? {
              // background: "var(--mui-palette-background-paper)",
              borderColor: "var(--mui-palette-divider)",
            }
          : {
              // background: "var(--mui-palette-background-default)",
            }),
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Stack
            direction="row"
            gap={2}
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Stack direction="row" gap={2} alignItems="baseline">
              <Button component={Link} to="/" sx={{ marginLeft: -1 }}>
                <Logo color="var(--mui-palette-text-primary)" />
              </Button>
              <MuiLink
                component={Link}
                to="/processes"
                sx={{
                  color: "#9EA2AA",
                  "&:hover": {
                    color: "var(--mui-palette-text-primary)",
                  },
                }}
                fontWeight={500}
                underline="none"
                variant="body2"
              >
                PROCESSES
              </MuiLink>
              <MuiLink
                component={Link}
                to="/modules"
                sx={{
                  color: "#9EA2AA",
                  "&:hover": {
                    color: "var(--mui-palette-text-primary)",
                  },
                }}
                fontWeight={500}
                underline="none"
                variant="body2"
              >
                MODULES
              </MuiLink>
              <MuiLink
                component={Link}
                to="/blocks"
                sx={{
                  color: "#9EA2AA",
                  "&:hover": {
                    color: "var(--mui-palette-text-primary)",
                  },
                }}
                fontWeight={500}
                underline="none"
                variant="body2"
              >
                BLOCKS
              </MuiLink>
            </Stack>
            <Stack direction="row" gap={2} alignItems="center">
              <SearchBar />
              <Box
                sx={{
                  height: 40,
                  "&.MuiBox-root > button > div": {
                    height: "fit-content",
                    padding: 0,
                  },
                  "&.MuiBox-root button": {
                    height: "100%",
                    borderRadius: 1,
                    border: "1px solid var(--mui-palette-divider)",
                    // border: "1px solid var(--mui-palette-accent-main)",
                    paddingX: 2.5,
                    paddingY: 1,
                    color: "var(--mui-palette-primary-main)",
                    background: "none",
                    // background: "rgba(var(--mui-palette-accent-mainChannel) / 0.05)",
                  },
                  "&.MuiBox-root button:active": {
                    transform: "scale(0.98) !important",
                  },
                  "& button:hover": {
                    transform: "none !important",
                    boxShadow: "none !important",
                  },
                  "& button > *": {
                    fontWeight: 500,
                    fontFamily: MainFontFF,
                    textTransform: "none",
                    lineHeight: 1,
                    fontSize: "0.8125rem",
                    padding: 0,
                  },
                  "& button svg": {
                    marginY: -1,
                  },
                }}
              >
                <ConnectButton
                  id="connect-wallet-button"
                  showBalance={false}
                  showProfilePicture={false}
                />
              </Box>
              <IconButton
                sx={{ fontSize: "1.125rem" }}
                size="large"
                onClick={() => {
                  const nextMode = mode === "dark" ? "light" : "dark"
                  setMode(nextMode)
                }}
              >
                {mode === "dark" ? <Moon weight="bold" /> : <Sun weight="bold" />}
              </IconButton>
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
