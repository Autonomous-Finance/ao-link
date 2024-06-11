import Query from "@irys/query"
import Arweave from "arweave"

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
})

export const BUNDLE_ID = "WUnVWUaEaiUEPMv70DP4JWqLmkYwuPkMPgDXv3SVRI8"

async function getBundleItems(bundleId) {
  const results = await new Query().search("irys:transactions").ids([bundleId])

  console.log("📜 LOG > getBundleItems > results:", results)
  //   const tx = await arweave.transactions.get(bundleId)
  // const items = JSON.parse(tx.get("data", { decode: true, string: true }))
  // return items
}

getBundleItems(BUNDLE_ID).then(console.log)
