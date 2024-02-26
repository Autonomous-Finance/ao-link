"use client"

import {
  AppBar,
  Container,
  IconButton,
  Stack,
  Button,
  Toolbar,
  useColorScheme,
} from "@mui/material"
import { Moon, Sun } from "@phosphor-icons/react"
import Link from "next/link"

import { Logo } from "./Logo"

const Header = () => {
  const { mode = "dark", setMode } = useColorScheme()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        border: 0,
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
            <Stack direction="row" gap={2}>
              <Button component={Link} href="/">
                <Logo color="var(--mui-palette-text-primary)" />
              </Button>
            </Stack>
            <IconButton
              size="small"
              onClick={() => {
                const nextMode = mode === "dark" ? "light" : "dark"
                setMode(nextMode)
              }}
            >
              {mode === "dark" ? <Moon weight="bold" /> : <Sun weight="bold" />}
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
