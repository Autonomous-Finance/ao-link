"use client"

import Highcharts from "highcharts"
import AccessibilityModule from "highcharts/modules/accessibility"
import AnnotationsModule from "highcharts/modules/annotations"
import HighchartsExporting from "highcharts/modules/exporting"
import HighchartsReact from "highcharts-react-official"

import { defaultOptions } from "@/components/Charts/defaultOptions"

if (typeof Highcharts === "object") {
  AccessibilityModule(Highcharts)

  HighchartsExporting(Highcharts)
  AnnotationsModule(Highcharts)
}

function formatNumber(num: number) {
  if (num >= 10000) {
    return (Math.floor(num / 100) / 10).toFixed(1) + "k"
  } else if (num >= 1000) {
    return (Math.floor(num / 100) / 10).toFixed(1) + "k"
  } else {
    return num.toString()
  }
}

export const AreaChart = ({ data, titleText }: any) => {
  const defaultOpt = defaultOptions({ titleText: "" })
  const options = {
    ...defaultOpt,

    annotations: [
      {
        draggable: "",
        labelOptions: {
          shape: "rect",
          backgroundColor: "transparent",
          borderWidth: 0,
        },
        labels: [
          {
            point: { x: 0, y: 50, xAxis: null, yAxis: null },
            formatter: function () {
              const series = this.series.chart.series[0]
              if (series?.data.length) {
                return `<p>${titleText}</p>
                        <br /><br />
                        <br /><br />
                      <p style="font-size: 32px">${
                        data.latest ? data.latest : formatNumber(data.count)
                      }
                      </p>
                      `
              }
              return ""
            },
          },
        ],
      },
    ] as Highcharts.AnnotationsOptions[],
    series: [
      {
        //@ts-ignore
        data: data.data.map(({ value, date }) => ({
          y: value,
          x: new Date(date),
        })),
        lineWidth: 0,
        type: "area",
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, "#29CC00"],
            [1, "#F2F2F2"],
          ],
        },
        yAxis: 0,
      },
    ],
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}
