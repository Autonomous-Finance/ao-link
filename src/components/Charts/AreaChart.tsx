"use client"

import { createOptionsForStat } from "@/components/Charts/defaultOptions"

import { HighchartAreaData } from "@/types"

import { Highchart, HighchartOptions } from "./Highchart"

type AreaChartProps = {
  data: HighchartAreaData[]
  titleText: string
}

export const AreaChart = ({ data, titleText }: AreaChartProps) => {
  const options: HighchartOptions = createOptionsForStat(
    titleText,
    150,
    undefined,
    data,
  )

  return <Highchart options={options} />
}
