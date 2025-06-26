"use client"

import { HighchartPieData } from "@/types"

import { Highchart, HighchartOptions } from "./Highchart"
import { defaultOpts } from "./defaultOptions"

type AreaChartProps = {
  data: HighchartPieData[]
  seriesTitle?: string
}

export const PieChart = ({ data, seriesTitle }: AreaChartProps) => {
  const options: HighchartOptions = {
    ...defaultOpts,
    chart: {
      backgroundColor: "transparent",
      height: defaultOpts.chart?.height,
      width: undefined,
    },
    series: [
      {
        name: seriesTitle,
        data,
        type: "pie",
      },
    ],
    tooltip: {
      ...defaultOpts.tooltip,
      formatter: undefined,
    },
  }

  return <Highchart options={options} />
}
