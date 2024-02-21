"use client"

import {
  AppBar,
  Container,
  Link as MuiLink,
  Stack,
  Toolbar,
} from "@mui/material"
import Image from "next/image"
import Link from "next/link"

const Header = () => {
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
          <Stack direction="row" gap={2}>
            <Image
              alt="ao"
              width={40}
              height={40}
              src="/ao.svg"
              className="inline-block h-[20px]"
            />
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
        </Toolbar>
      </Container>
    </AppBar>

    // <nav className="navbar">
    //   <div className="navbar-start">
    //     <ul className="menu menu-horizontal nav-bar-button flex gap-[32px]">
    //       <li className="-mx-4">
    //         <div className="flex items-center gap-1">
    //         </div>
    //       </li>
    //       <li>
    //         <Link href="/">Scan</Link>
    //       </li>
    //     </ul>
    //   </div>
    //   <div className="navbar-end"></div>
    // </nav>
  )
}

export default Header
