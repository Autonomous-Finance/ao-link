"use client"

import {
  AppBar,
  Container,
  IconButton,
  Link as MuiLink,
  Stack,
  Toolbar,
  useColorScheme,
} from "@mui/material"
import { Moon, Sun } from "@phosphor-icons/react"
import Link from "next/link"

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
              <svg
                className="inline-block h-[20px]"
                width={40}
                height={40}
                viewBox="0 0 24 13"
                fill="var(--mui-palette-text-primary)"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 12.472H3.99308L4.80799 10.2684L2.97444 6.51398L0 12.472Z"
                  fill="inherit"
                />
                <path
                  d="M10.5939 9.493L6.1526 0.555939L4.80799 3.61658L9.0048 12.472H12.028L10.5939 9.493Z"
                  fill="inherit"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.014 12.472C21.32 12.472 24 9.792 24 6.48601C24 3.18003 21.32 0.5 18.014 0.5C14.708 0.5 12.028 3.18003 12.028 6.48601C12.028 9.792 14.708 12.472 18.014 12.472ZM18.014 10.1224C20.0223 10.1224 21.6503 8.49432 21.6503 6.48601C21.6503 4.47771 20.0223 2.84965 18.014 2.84965C16.0057 2.84965 14.3776 4.47771 14.3776 6.48601C14.3776 8.49432 16.0057 10.1224 18.014 10.1224Z"
                  fill="inherit"
                />
              </svg>
              <MuiLink
                component={Link}
                href="/"
                color="text.secondary"
                sx={{
                  textTransform: "uppercase",
                  "&:hover": {
                    color: "text.primary",
                  },
                }}
                fontWeight={500}
                underline="none"
              >
                Scan
              </MuiLink>
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
