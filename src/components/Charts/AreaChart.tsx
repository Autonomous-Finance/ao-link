"use client"

import { createOptionsForStat } from "@/components/Charts/defaultOptions"

import { HighchartAreaData } from "@/types"

import { Highchart, HighchartOptions } from "./Highchart"

type AreaChartProps = {
  data: HighchartAreaData[]
  titleText: string
  overrideValue?: number
}

export const AreaChart = ({
  data,
  titleText,
  overrideValue,
}: AreaChartProps) => {
  const options: HighchartOptions = createOptionsForStat(
    titleText,
    150,
    undefined,
    data,
    overrideValue,
  )

  return <Highchart options={options} />
}
