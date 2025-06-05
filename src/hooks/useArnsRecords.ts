import { useStore } from "@nanostores/react"

import { ArnsRecord, getAllRecords } from "@/services/arns-api"
import {
  $arnsRecordsMap,
  $arnsRecordsMapFetching,
  $arnsRecordsMapRefresh,
} from "@/stores/arns-records-store"
import { shouldRefreshNanostore } from "@/services/cache-config"

export function useArnsRecordsMap() {
  const recordsMapStringified = useStore($arnsRecordsMap)
  const refresh = $arnsRecordsMapRefresh.get()
  const shouldRefresh = shouldRefreshNanostore(refresh)

  // TEMPORARILY DISABLED: This was causing massive rate limiting by fetching ALL ArNS records
  // if (shouldRefresh && $arnsRecordsMapFetching.get() !== "true") {
  //   console.log("Refetching arns records.")
  //   $arnsRecordsMapFetching.set("true")
  //   console.log("Fetching all ARNS records.")
  //   getAllRecords()
  //     .then((records) => {
  //       console.log("Fetched all ARNS records.")
  //       $arnsRecordsMapRefresh.set(new Date().getTime().toString())
  //       $arnsRecordsMapFetching.set("false")
  //       $arnsRecordsMap.set(JSON.stringify(records))
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //       $arnsRecordsMapFetching.set("false")
  //     })
  // }

  if (!recordsMapStringified) return undefined

  const recordsMap = JSON.parse(recordsMapStringified) as Record<string, ArnsRecord>
  return recordsMap
}

export function useArnsRecords() {
  const recordsMap = useArnsRecordsMap()

  if (!recordsMap) return undefined

  const records: ArnsRecord[] = Object.keys(recordsMap).map((name) => ({
    ...recordsMap[name],
    name,
  }))
  records.sort((a, b) => a.name.localeCompare(b.name))

  return records
}
