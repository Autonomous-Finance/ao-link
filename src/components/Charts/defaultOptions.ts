import type Highcharts from "highcharts"

export const defaultOptions = ({
  titleText,
}: {
  titleText?: string
}): Highcharts.Options => ({
  title: {
    text: titleText,
    align: "left",
    style: {
      color: "rgb(var(--font-color))",
    },
  },
  exporting: {
    enabled: false,
  },
  chart: {
    backgroundColor: "rgb(var(--background-color))",
    height: 150,
  },
  plotOptions: {
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
    },
  },
  legend: {
    enabled: false,
  },
  yAxis: {
    visible: false,
  },
  xAxis: {
    visible: false,
  },
  tooltip: {
    useHTML: true,
    shadow: true,
    shared: true,
    pointFormatter: function () {
      const originalDate = new Date(this.x)
      const formattedDateString = originalDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })

      return `<strong>${formattedDateString}</strong><br /><strong>${this.y}</strong`
    }!,
    headerFormat: "",
  },
})
