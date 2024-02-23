export type HighchartOptions = Highcharts.Options

import dayjs from "dayjs"

import { HighchartAreaData } from "@/types"
import { formatNumber } from "@/utils/number-utils"

import { TitleFontFF } from "../RootLayout/fonts"

export const defaultOpts: HighchartOptions = {
  title: {
    text: "",
  },
  exporting: {
    enabled: false,
  },
  chart: {
    events: {
      load: function () {
        this.renderer.image("/logo_with_text.svg").add()
      },
    },
    backgroundColor: "transparent",
    height: 600,
  },
  legend: {
    layout: "horizontal",
    align: "left",
    verticalAlign: "bottom",
    itemMarginTop: 10,
    itemMarginBottom: 20,
    itemHoverStyle: {
      color: "rgb(var(--secondary-color))",
    },
    itemStyle: {
      color: "var(--mui-palette-text-primary)",
    },
  },
  xAxis: {
    gridLineColor: "var(--mui-palette-divider)",
    tickColor: "var(--mui-palette-text-primary)",
    labels: {
      style: {
        color: "var(--mui-palette-text-primary)",
      },
    },
    type: "datetime",
  },
  yAxis: {
    gridLineColor: "var(--mui-palette-divider)",
    labels: {
      // format: "{value}",
      style: {
        color: "var(--mui-palette-text-primary)",
      },
    },
    title: {
      text: "",
    },
  },
  tooltip: {
    borderWidth: 1,
    borderColor: "var(--mui-palette-divider)",
    backgroundColor: "var(--mui-palette-background-paper)",
    style: {
      color: "var(--mui-palette-text-primary)",
    },
    shadow: false,
    shared: true,
    formatter: function () {
      const header = `<b style="font-size: 14px;">${
        typeof this.x === "number"
          ? dayjs(this.x).format("YYYY-MM-DD HH:mm")
          : this.x
      }</b><br/><br/>`

      const pointsInfo = this.points
        ?.sort((a, b) => Number(b.y) - Number(a.y))
        .map((point) => {
          return `<span style="color:${point.color}">\u25CF</span> ${
            point.series.name
          }: <b>${formatNumber(Number(point.y), { notation: "compact" })}</b>`
        })
        .join("<br/>")

      return header + pointsInfo
    },
    // xDateFormat: "%Y-%m-%d %H:%M",
    // headerFormat: '<b style="font-size: 14px;">{point.key}</b><br/><br/>',
  },
  // TODO
  // navigator: {
  //   outlineColor: "var(--mui-palette-divider)",
  //   xAxis: {
  //     gridLineColor: "var(--mui-palette-divider)",
  //     tickColor: "var(--mui-palette-text-primary)",
  //     labels: {
  //       style: {
  //         color: "var(--mui-palette-text-primary)",
  //         opacity: 1,
  //         textOutline: "var(--mui-palette-background-paper)",
  //       },
  //     },
  //   },
  //   enabled: true,
  // },
  plotOptions: {
    series: {
      turboThreshold: 10_000,
    },
    area: {
      marker: {
        enabled: false,
        symbol: "circle",
        radius: 2,
        states: {
          hover: {
            enabled: true,
          },
        },
      },
      states: {
        hover: {
          lineWidth: 1,
        },
      },
      threshold: null,
    },
  },
}

export function createOptionsForStat(
  titleText: string,
  chartHeight: number,
  chartWidth: number | undefined,
  data: HighchartAreaData[],
  overrideValue: number | undefined,
  exportServer = false,
): HighchartOptions {
  const fontColor = exportServer
    ? "rgb(255, 255, 255)"
    : "var(--mui-palette-text-primary)"
  const backgroundColor = exportServer ? "#252424" : "transparent"

  const fontSizes = {
    title: exportServer ? "36px" : "12px",
    value: exportServer ? "96px" : "32px",
  }

  return {
    title: {
      align: "left",
      style: {
        fontFamily: exportServer ? "Helvetica" : TitleFontFF,
        fontSize: fontSizes.title,
        color: fontColor,
      },
      text: "",
    },
    exporting: {
      enabled: false,
    },
    chart: {
      backgroundColor,
      height: chartHeight,
      width: chartWidth,
    },
    plotOptions: defaultOpts.plotOptions,
    legend: {
      enabled: false,
    },
    yAxis: {
      visible: false,
    },
    xAxis: {
      visible: false,
    },
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
            allowOverlap: true,
            point: { x: 0, y: 50, xAxis: null, yAxis: null },
            formatter: function () {
              return `<span style="color: ${fontColor}">${titleText}</span>`
            },
          },
          {
            point: {
              x: 0,
              y: exportServer ? 208 : 104,
              xAxis: null,
              yAxis: null,
            },
            allowOverlap: true,
            text: (function () {
              if (data.length) {
                const [_lastX, lastY = 0] = data.at(-1)!

                const value = Intl.NumberFormat("en", {
                  maximumSignificantDigits: 3,
                  notation: "compact",
                }).format(overrideValue || lastY)

                return `<span style="font-size: ${fontSizes.value}; color: ${fontColor}">${value}</span>`
              }
              return ""
            })(),
          },
        ],
      },
    ],
    series: [
      {
        data,
        lineWidth: 1,
        lineColor: "#29CC00",
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, "rgba(41, 204, 0, 1)"],
            [0.5, "rgba(41, 204, 0, 0.33)"],
            [1, "rgba(41, 204, 0, 0)"],
          ],
        },
        type: "area",
        yAxis: 0,
      },
    ],
    tooltip: {
      ...defaultOpts.tooltip,
      useHTML: true,
      shadow: false,
      shared: true,
      formatter: function () {
        const formattedDateString = new Date(this.x as number).toLocaleString(
          undefined,
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          },
        )
        const value = Intl.NumberFormat("en", {
          maximumSignificantDigits: 3,
          notation: "compact",
        }).format(this.y!)
        return `${formattedDateString} <br /><strong>${value}</strong>`
      }!,
      headerFormat: "",
    },
    credits: {
      enabled: false,
      // TODO
      //   enabled: exportServer,
      //   text: "https://dataos.so",
      //   style: {
      //     fontSize: "24px",
      //   },
    },
  }
}
