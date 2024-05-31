import { Client, cacheExchange, fetchExchange } from "urql"

export const goldsky = new Client({
  url: "https://arweave-search.goldsky.com/graphql",
  exchanges: [cacheExchange, fetchExchange],
})
