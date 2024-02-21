import type { Metadata } from "next"

import "./globals.css"
import RootLayoutUI from "../components/RootLayout/RootLayoutUI"

export const metadata: Metadata = {
  title: "AOScan",
  icons: {
    icon: "/ao.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <RootLayoutUI>{children}</RootLayoutUI>
      </body>
    </html>
  )
}
