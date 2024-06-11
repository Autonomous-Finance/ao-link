import { Stack, Typography } from "@mui/material"
import React from "react"

import { MonoFontFF } from "./RootLayout/fonts"
import { TYPE_COLOR_MAP, TYPE_ICON_MAP } from "@/utils/data-utils"

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
        sx={{
          background: TYPE_COLOR_MAP[type],
          padding: "4px 8px",
          width: "fit-content",
        }}
        alignItems="center"
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
