import type { Metadata } from "next"
import { Inter, DM_Sans } from "next/font/google"

import "./globals.css"
import RootLayoutUI from "../components/RootLayout/RootLayoutUI"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmSans" })

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
      <body
        className={`px-[32px] ${inter.variable} ${dmSans.variable} font-dmSans`}
      >
        <RootLayoutUI>{children}</RootLayoutUI>
      </body>
    </html>
  )
}
