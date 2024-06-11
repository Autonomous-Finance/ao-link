#!/usr/bin/env node

import Irys from "@irys/sdk"
import { config } from "dotenv"

config()
const DEPLOY_KEY = process.env.DEPLOY_KEY
const ANT_CONTRACT = process.env.ARNS_ANT_CONTRACT

async function deploy() {
  if (!DEPLOY_KEY) throw new Error("DEPLOY_KEY not configured")
  if (!ANT_CONTRACT) throw new Error("ANT_CONTRACT not configured")

  const jwk = JSON.parse(Buffer.from(DEPLOY_KEY, "base64").toString("utf-8"))
  const irys = new Irys({
    network: "mainnet",
    // url: "https://turbo.ardrive.io",
    token: "arweave",
    key: jwk,
  })

  const balance = await irys.getBalance("yqRGaljOLb2IvKkYVa87Wdcc8m_4w6FI58Gej05gorA")
  console.log("📜 LOG > node balance:", irys.utils.fromAtomic(balance), irys.token)

  const fundTx = await irys.fund(irys.utils.toAtomic(1))
  console.log(
    `📜 LOG > Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${irys.token}`,
  )
}

deploy().then()
