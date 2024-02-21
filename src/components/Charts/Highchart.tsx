import Highcharts from "highcharts/highstock"
import AccessibilityModule from "highcharts/modules/accessibility"
import AnnotationsModule from "highcharts/modules/annotations"
import HighchartsExporting from "highcharts/modules/exporting"
import HighchartsTreemap from "highcharts/modules/treemap"
import HighchartsReact, {
  HighchartsReactProps,
} from "highcharts-react-official"
import React from "react"

if (typeof Highcharts === "object") {
  AccessibilityModule(Highcharts)
  AnnotationsModule(Highcharts)
  HighchartsExporting(Highcharts)
  HighchartsTreemap(Highcharts)
}

export type HighchartOptions = Highcharts.Options

export function Highchart(props: HighchartsReactProps) {
  return <HighchartsReact highcharts={Highcharts} {...props} />
}
