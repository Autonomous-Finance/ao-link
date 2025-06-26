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
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  InputAdornment,
  TextField,
} from "@mui/material"
import { Moon, Sun, List as MenuIcon, XCircle, MagnifyingGlass, ArrowLeft } from "@phosphor-icons/react"
import { Link, useNavigate } from "react-router-dom"
import { useState, useCallback } from "react" // Imported useCallback

import { Logo } from "./Logo"
import { MainFontFF } from "./RootLayout/fonts"
import SearchBar from "@/app/SearchBar"
import { usePrimaryArnsName } from "@/hooks/usePrimaryArnsName"
import { useArnsLogo } from "@/hooks/useArnsLogo"
import { theme } from "./RootLayout/theme" // Import theme for breakpoints

const ProfileButton = () => {
  const activeAddress = useActiveAddress()
  const { data: arnsName, isLoading: isLoadingName } = usePrimaryArnsName(activeAddress || "")
  const { data: logoTxId, isLoading: isLoadingLogo } = useArnsLogo(arnsName || "")

  const handleProfileClick = () => {
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

const navItems = [
  { label: "PROCESSES", path: "/processes" },
  { label: "MODULES", path: "/modules" },
  { label: "BLOCKS", path: "/blocks" },
  { label: "ARNS", path: "/arns" },
]

const Header = () => {
  const { mode = "dark", setMode } = useColorScheme()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileSearchActive, setMobileSearchActive] = useState(false) // State for mobile search visibility
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const elevated = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: typeof window !== "undefined" ? window : undefined,
  })

  const toggleDrawer = useCallback((open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return
    }
    setDrawerOpen(open)
  }, [setDrawerOpen]) // Added setDrawerOpen to dependency array, though empty [] might also work if setDrawerOpen is guaranteed stable

  const drawerContent = (
    <Box
      sx={{ width: 250, paddingTop: 2 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Stack direction="row" justifyContent="flex-end" sx={{ paddingX: 2, marginBottom: 1 }}>
        <IconButton onClick={toggleDrawer(false)}>
          <XCircle size={24} />
        </IconButton>
      </Stack>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.default",
          border: 0,
          borderBottom: "1px solid transparent",
          ...(elevated
            ? {
                borderColor: "var(--mui-palette-divider)",
              }
            : {}),
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile && mobileSearchActive ? (
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <IconButton onClick={() => setMobileSearchActive(false)} color="inherit" sx={{ mr: 1 }}>
                  <ArrowLeft />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                  <SearchBar />
                </Box>
              </Stack>
            ) : (
              <Stack
                direction="row"
                gap={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <Stack direction="row" gap={{ xs: 1, sm: 2 }} alignItems="center">
                  <Button component={Link} to="/" sx={{
                    minWidth: { xs: 'auto', sm: '64px' }, // Allow button to shrink for logo only
                    padding: { xs: 0.5, sm: '6px 8px' },
                    marginLeft: { xs: 0, sm: -1 }
                  }}>
                    <Logo color="var(--mui-palette-text-primary)" />
                  </Button>
                  {!isMobile && (
                    <Stack direction="row" gap={2} alignItems="baseline">
                      {navItems.map((item) => (
                        <MuiLink
                          key={item.label}
                          component={Link}
                          to={item.path}
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
                          {item.label}
                        </MuiLink>
                      ))}
                    </Stack>
                  )}
                </Stack>
                <Stack direction="row" gap={{ xs: 0.5, sm: 1 }} alignItems="center"> {/* Reduced gap for mobile icons */}
                  {!isMobile && <SearchBar />}
                  {isMobile && (
                    <>
                      <IconButton
                        color="inherit"
                        aria-label="open search"
                        onClick={() => setMobileSearchActive(true)}
                      >
                        <MagnifyingGlass />
                      </IconButton>
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleDrawer(true)}
                        sx={{ display: { md: "none" } }}
                      >
                        <MenuIcon />
                      </IconButton>
                    </>
                  )}
                  <Box
                    sx={{
                      height: 40,
                    display: { xs: isMobile ? 'none' : 'block', sm: 'block' }, // Reverted to original logic
                    "&.MuiBox-root > button > div": {
                      height: "fit-content",
                      padding: 0,
                    },
                    "&.MuiBox-root button": {
                      height: "100%",
                      borderRadius: 1,
                      border: "1px solid var(--mui-palette-divider)",
                      paddingX: { xs: 1.5, sm: 2.5 },
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
                    const nextMode = mode === "dark" ? "light" : "dark";
                    setMode(nextMode);
                  }} // Carefully restored original logic
                >
                  {mode === "dark" ? <Moon weight="bold" /> : <Sun weight="bold" />}
                </IconButton>
              </Stack>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  )
}

export default Header
