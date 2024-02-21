"use client"

import { Container } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles"

import { theme } from "./theme"
import { Footer } from "../Footer"
import Header from "../Header"

export default function RootLayoutUI({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CssVarsProvider theme={theme} defaultMode="light">
        <CssBaseline />
        <Header />
        <Container maxWidth="xl">{children}</Container>
        <Footer />
      </CssVarsProvider>
    </>
  )
}
