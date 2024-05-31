import { Skeleton } from "@mui/material"
import React from "react"

export function LoadingSkeletons() {
  return (
    <>
      <Skeleton height={40} />
      <Skeleton height={40} />
      <Skeleton height={40} />
      <Skeleton height={40} />
    </>
  )
}
