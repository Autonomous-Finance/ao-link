"use client"

import { createOptionsForStat } from "@/components/Charts/defaultOptions"

import { HighchartAreaDataServer } from "@/types"

import { formatAbsString } from "@/utils/date-utils"

import { Highchart, HighchartOptions } from "./Highchart"

type AreaChartProps = {
  data: HighchartAreaDataServer[]
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
    data.map(([date, value]) => [formatAbsString(date), value]),
    overrideValue,
  )

  return <Highchart options={options} />
}
