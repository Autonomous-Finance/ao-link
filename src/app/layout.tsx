import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmSans", });

export const metadata: Metadata = {
  title: "AOScan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`px-[32px] ${inter.variable} ${dmSans.variable} font-dmSans max-w-screen-lg mx-auto`}>
        {children}
      </body>
    </html>
  );
}
