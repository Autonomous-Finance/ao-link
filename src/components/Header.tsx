"use client"

import { ConnectButton, useActiveAddress } from "@arweave-wallet-kit/react"
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

import { Link } from "react-router-dom"

import { Logo } from "./Logo"
import { MainFontFF } from "./RootLayout/fonts"
import SearchBar from "@/app/SearchBar"
import { usePrimaryArnsName } from "@/hooks/usePrimaryArnsName"
import { useArnsLogo } from "@/hooks/useArnsLogo"

const ProfileButton = () => {
  const activeAddress = useActiveAddress()
  const { data: arnsName, isLoading: isLoadingName } = usePrimaryArnsName(activeAddress || "")
  const { data: logoTxId, isLoading: isLoadingLogo } = useArnsLogo(arnsName || "")

  // Debug logging
  console.log("Profile Debug:", { activeAddress, arnsName, logoTxId, isLoadingName, isLoadingLogo })

  const handleProfileClick = () => {
    // Find and click the hidden ConnectButton to trigger its modal
    const connectButton = document.getElementById('hidden-connect-button')
    if (connectButton) {
      connectButton.click()
    }
  }

  if (!activeAddress) {
    return (
      <ConnectButton
        id="connect-wallet-button"
        showBalance={false}
        showProfilePicture={false}
        useAns={false}
      />
    )
  }

  if (isLoadingName) {
    return (
      <ConnectButton
        id="connect-wallet-button"
        showBalance={false}
        showProfilePicture={false}
        useAns={false}
      />
    )
  }

  if (arnsName) {
    return (
      <Box sx={{ position: 'relative' }}>
        <Button
          onClick={handleProfileClick}
          sx={{
            height: "100%",
            borderRadius: 1,
            border: "1px solid var(--mui-palette-divider)",
            paddingX: 2.5,
            paddingY: 1,
            color: "var(--mui-palette-primary-main)",
            background: "none",
            fontWeight: 500,
            fontFamily: MainFontFF,
            textTransform: "none",
            lineHeight: 1,
            fontSize: "0.8125rem",
            minWidth: "auto",
            "&:active": {
              transform: "scale(0.98) !important",
            },
            "&:hover": {
              transform: "none !important",
              boxShadow: "none !important",
              backgroundColor: "rgba(var(--mui-palette-primary-mainChannel) / 0.04)",
            },
          }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            {logoTxId && (
              <Box
                component="img"
                src={`https://arweave.net/${logoTxId}`}
                alt={`${arnsName} logo`}
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  console.log("Logo failed to load:", logoTxId)
                  e.currentTarget.style.display = "none"
                }}
              />
            )}
            <span>{arnsName}</span>
          </Stack>
        </Button>
        {/* Hidden ConnectButton to trigger wallet modal */}
        <Box sx={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>
          <ConnectButton
            id="hidden-connect-button"
            showBalance={false}
            showProfilePicture={false}
            useAns={false}
          />
        </Box>
      </Box>
    )
  }

  return (
    <ConnectButton
      id="connect-wallet-button"
      showBalance={false}
      showProfilePicture={false}
      useAns={false}
    />
  )
}

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
              <MuiLink
                component={Link}
                to="/arns"
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
                ARNS
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
                    paddingX: 2.5,
                    paddingY: 1,
                    color: "var(--mui-palette-primary-main)",
                    background: "none",
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
                <ProfileButton />
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
