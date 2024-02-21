import { Stack, Typography } from "@mui/material"
import Image from "next/image"
import React from "react"

import { TYPE_COLOR_MAP, TYPE_ICON_MAP } from "@/utils/data-utils"

import { MonoFontFF } from "./RootLayout/fonts"

export const SectionInfoWithChip = ({
  title,
  value,
}: {
  title: string
  value: string
}) => (
  <Stack gap={1} direction="row">
    <Typography variant="subtitle2" color="text.secondary" width={220}>
      {title}
    </Typography>
    <Stack
      direction="row"
      gap={1}
      className={`flex min-w-[70px] py-1 px-2 space-x-1 items-center ${
        value.toLocaleLowerCase() === "process"
          ? TYPE_COLOR_MAP["Process"]
          : TYPE_COLOR_MAP["Message"]
      }`}
    >
      <Typography
        textTransform="uppercase"
        variant="body2"
        fontFamily={MonoFontFF}
      >
        {value}
      </Typography>
      <Image alt="icon" width={8} height={8} src={TYPE_ICON_MAP[value]} />
    </Stack>
  </Stack>
)
