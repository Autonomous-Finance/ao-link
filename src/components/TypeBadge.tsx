import { Stack, Typography } from "@mui/material"
import React from "react"

import { TYPE_COLOR_MAP, TYPE_ICON_MAP } from "@/utils/data-utils"

import { MonoFontFF } from "./RootLayout/fonts"

type TypeBadgeProps = {
  type: string
}

export function TypeBadge(props: TypeBadgeProps) {
  const { type } = props

  return (
    <>
      <Stack
        direction="row"
        gap={1}
        className={` ${TYPE_COLOR_MAP[type]}`}
        sx={{ padding: "4px 8px", width: "fit-content" }}
      >
        <Typography
          textTransform="uppercase"
          variant="body2"
          fontFamily={MonoFontFF}
          sx={{ color: "black" }}
        >
          {type}
        </Typography>
        {TYPE_ICON_MAP[type] && <img alt="icon" width={8} height={8} src={TYPE_ICON_MAP[type]} />}
      </Stack>
    </>
  )
}
