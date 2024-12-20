import { TokenInfo } from "@/services/token-api"

export const nativeTokenInfo: TokenInfo = {
  processId: "m3PaWzK4PTG9lAaqYQPaPdOcXdO8hYqi5Fe9NWqXd0w",
  denomination: 12,
  ticker: "AO",
  logo: "UkS-mdoiG8hcAClhKK8ch4ZhEzla0mCPDOix9hpdSFE",
  name: "AO",
}

export const tokenMirrors = {
  [nativeTokenInfo.processId]: "Pi-WmAQp2-mh-oWH9lWpz5EthlUDj_W0IusAv-RXhRk",
}
