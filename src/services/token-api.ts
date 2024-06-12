import { dryrun } from "@permaweb/aoconnect/browser"

import { nativeTokenInfo } from "../utils/native-token"
import { isArweaveId } from "../utils/utils"

export type TokenInfo = {
  processId: string
  denomination: number
  ticker: string
  logo: string
  name: string
}

export type TokenHolder = {
  rank: number
  entityId: string
  balance: number
}

export async function getBalance(tokenId: string, entityId: string, tokenV2 = true) {
  const result = await dryrun({
    process: tokenId,
    data: "",
    tags: [
      { name: "Action", value: "Balance" },
      // TODO FIXME combine these tags?
      { name: tokenV2 ? "Recipient" : "Target", value: entityId },
    ],
  })

  try {
    if (result.Messages.length === 0) throw new Error(`No response from (get) Balance (${tokenId})`)
    const message = result.Messages[0]
    const account = message.Tags?.find((tag: any) => tag.name === "Account")?.value
    if (account !== entityId) {
      throw new Error("Account mismatch")
    }
    const balance = message.Data || message.Tags?.find((tag: any) => tag.name === "Balance")?.value
    const balanceNumber = parseFloat(balance)
    return balanceNumber
  } catch (err) {
    console.error(err)
    if (tokenV2) return getBalance(tokenId, entityId, false)
  }

  return null
}

type BalanceMap = {
  [key: string]: string | number
}

export async function getTokenHolders(tokenInfo: TokenInfo): Promise<TokenHolder[]> {
  const result = await dryrun({
    process: tokenInfo.processId,
    data: "",
    tags: [{ name: "Action", value: "Balances" }],
  })

  try {
    if (result.Messages.length === 0)
      throw new Error(`No response from (get) Balances (${tokenInfo.name})`)
    const balanceMap = JSON.parse(result.Messages[0].Data) as BalanceMap
    const tokenHolders = Object.keys(balanceMap)
      .filter((entityId) => balanceMap[entityId] !== "0" && balanceMap[entityId] !== 0)
      .sort((a, b) => Number(balanceMap[b]) - Number(balanceMap[a]))
      .map((entityId, index) => ({
        rank: index + 1,
        entityId,
        balance: Number(balanceMap[entityId]) / 10 ** tokenInfo.denomination,
      }))

    return tokenHolders
  } catch (err) {
    console.error(err)
  }

  return []
}

type Tag = {
  name: string
  value: string
}

export async function getTokenInfo(processId: string): Promise<TokenInfo> {
  if (!isArweaveId(processId)) {
    throw new Error("Invalid Arweave ID")
  }
  if (nativeTokenInfo.processId === processId) return nativeTokenInfo

  const result = await dryrun({
    process: processId,
    data: "",
    tags: [{ name: "Action", value: "Info" }],
  })

  if (result.Messages.length === 0) throw new Error(`No response from (get) Info (${processId})`)
  const tags = result.Messages[0].Tags as Tag[]
  const tagMap = tags.reduce(
    (acc, tag) => {
      acc[tag.name] = tag.value
      return acc
    },
    {} as { [key: string]: string },
  )

  const denomination = parseInt(tagMap["Denomination"])

  if (isNaN(denomination)) throw new Error("Denomination is not a number")

  return {
    processId: processId,
    denomination,
    ticker: tagMap["Ticker"],
    logo: tagMap["Logo"],
    name: tagMap["Name"],
  }
}
