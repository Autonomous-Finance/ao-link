import { DM_Sans, Roboto_Mono } from "next/font/google"

const RobotoMono = Roboto_Mono({
  display: "block",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
})

const DmSans = DM_Sans({
  display: "block",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
})

export const MainFontFF = DmSans.style.fontFamily
export const MonoFontFF = RobotoMono.style.fontFamily
export const TitleFontFF = RobotoMono.style.fontFamily
