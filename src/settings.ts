import { connect } from "@permaweb/aoconnect/browser"

import { arIoCu } from "./services/arns-api"

export const tokenCUs: Record<string, ReturnType<typeof connect> | undefined> = {
  qNvAoz0TgcH7DMg8BCVn8jF32QH5L6T29VjHxhHqqGE: arIoCu,
}

export const defaultCu = connect()

export function getTokenCu(tokenId: string) {
  return tokenCUs[tokenId] || defaultCu
}
