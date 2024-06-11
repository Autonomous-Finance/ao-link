import { persistentAtom, persistentMap } from "@nanostores/persistent"

export const $tokenInfoRefresh = persistentAtom<string>("token-info-refresh", "0")

export const $tokenInfoCache = persistentMap<Record<string, string | undefined>>(
  "token-info-cache",
  {},
)

// cleanup cache stuck in "loading" state
const cache = $tokenInfoCache.get()
for (const tokenId in cache) {
  if (cache[tokenId] === "loading" || cache[tokenId] === "error") {
    $tokenInfoCache.setKey(tokenId, undefined)
  }
}

const refresh = $tokenInfoRefresh.get()
const delta = new Date().getTime() - parseInt(refresh)
const oneWeek = 604800000

if (refresh === "0" || delta > oneWeek) {
  console.log("Resetting token cache.")

  for (const tokenId in cache) {
    $tokenInfoCache.setKey(tokenId, undefined)
  }
  $tokenInfoRefresh.set(new Date().getTime().toString())
}
