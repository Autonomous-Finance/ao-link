"use client"

import { useMediaQuery } from "@mui/material"
import { Highchart, HighchartOptions } from "./Highchart"
import { createOptionsForStat } from "@/components/Charts/defaultOptions"
import { theme } from "../RootLayout/theme" // Import theme for breakpoints


import { HighchartAreaData } from "@/types"

type AreaChartProps = {
  data: HighchartAreaData[]
  titleText: string
  overrideValue?: number
}

export const AreaChart = ({ data, titleText, overrideValue }: AreaChartProps) => {
  const isSmallChart = useMediaQuery(theme.breakpoints.down("sm")) // Use sm breakpoint for "small" variant

  const options: HighchartOptions = createOptionsForStat(
    titleText,
    150, // Chart height remains fixed for these stat charts
    undefined, // Chart width is responsive by default
    data,
    overrideValue,
    false, // exportServer
    isSmallChart ? "small" : "normal", // Pass sizeVariant
  )

  return <Highchart options={options} />
}
