"use client"
import * as d3 from "d3"
import { type Simulation, type SimulationNodeDatum } from "d3-force"
import React, { memo, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

function linkArc(d: CustomLink) {
  const dx = d.target.x - d.source.x
  const dy = d.target.y - d.source.y
  const dr = Math.sqrt(dx * dx + dy * dy) * (1 + Math.abs(d.curvature)) // Increase the distance based on curvature
  const sweepFlag = d.curvature > 0 ? 1 : 0
  return `
    M${d.source.x},${d.source.y}
    A${dr},${dr} 0 0,${sweepFlag} ${d.target.x},${d.target.y}`
}

const drag = (simulation: Simulation<CustomNode, undefined>, largeGraph: boolean) => {
  function dragstarted(event: d3.D3DragEvent<SVGGElement, CustomNode, CustomNode>, d: CustomNode) {
    if (!event.active)
      simulation
        .alphaTarget(0.3)
        .alphaDecay(largeGraph ? 1 : defaultAlphaDecay)
        .restart()

    d.fx = d.x
    d.fy = d.y
  }

  function dragged(event: d3.D3DragEvent<SVGGElement, CustomNode, CustomNode>, d: CustomNode) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(event: d3.D3DragEvent<SVGGElement, CustomNode, CustomNode>, d: CustomNode) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  return d3
    .drag<SVGGElement, CustomNode>()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
}

export interface ChartDataItem {
  id: string
  source: string
  source_id: string
  target: string
  target_id: string
  type: "User Message" | "Cranked Message"
  action: string
  highlight?: boolean
}

interface CustomNode extends SimulationNodeDatum {
  id: string
  label: string
  x: number
  y: number
}

interface CustomLink extends SimulationNodeDatum {
  source: CustomNode
  target: CustomNode
  type: "User Message" | "Cranked Message"
  action: string
  id: string
  highlight?: boolean
  curvature: number
}

const COLORS = {
  lightGreen: "#57E51A",
  green: "#6BB24C",
  lightRed: "#596EA6",
  red: "#D52C2C",
  blue: "#0046FF",
}

const defaultAlphaDecay = 0.0228

interface GraphProps {
  data: ChartDataItem[]
}

const SMALL_GRAPH = {
  nodeRadius: 8,
  linkWidth: 2,
  arrowWidth: 4,
  arrowDistance: 20,
  distance: 200,
  fontSize: "0.75rem",
  chargeStrength: -40,
}

const MEDIUM_GRAPH = {
  nodeRadius: 12,
  linkWidth: 8,
  arrowWidth: 4,
  arrowDistance: 12,
  distance: 100,
  fontSize: "1rem",
  chargeStrength: -400,
}

const LARGE_GRAPH = {
  nodeRadius: 16,
  linkWidth: 8,
  arrowWidth: 4,
  arrowDistance: 14,
  distance: 300,
  fontSize: "1rem",
  chargeStrength: -50,
}

function BaseGraph(props: GraphProps) {
  const { data: chartData } = props

  // const sizes =
  //   chartData.length < 4 ? LARGE_GRAPH : chartData.length < 8 ? MEDIUM_GRAPH : SMALL_GRAPH

  const sizes = SMALL_GRAPH

  const svgRef = useRef<SVGSVGElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!chartData || chartData.length === 0) return

    // Initialize chart only once and update it on data changes
    const svg = d3.select(svgRef.current)
    const width = 500
    const height = 480
    svg
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr(
        "style",
        "max-width: 100%; height: auto; font: 12px sans-serif; background: transparent;",
      )

    const types = Array.from(new Set(chartData.map((d) => d.type)))
    const nodes: CustomNode[] = Array.from(
      new Set(chartData.flatMap((l) => [l.source_id, l.target_id])),
      (id) => {
        // lookup original node and take the id column, which is actualy the label but is still named id for backwards compat in the api
        const original = chartData.find((l) => l.source_id === id || l.target_id === id)
        const label = original
          ? original.source_id === id
            ? original.source
            : original.target
          : ""
        return { id, label, x: 0, y: 0 }
      },
    )
    const links: CustomLink[] = chartData.map((d, i, arr) => {
      const sameLinks = arr.filter(
        (link) =>
          (link.source_id === d.source_id && link.target_id === d.target_id) ||
          (link.source_id === d.target_id && link.target_id === d.source_id),
      )
      const sameIndex = sameLinks.findIndex((link) => link === d)
      const curvature = (sameIndex - (sameLinks.length - 1) / 2) * 0.5 // Adjust curvature factor as needed
      return {
        ...d,
        source: nodes.find((n) => n.id === d.source_id) as CustomNode,
        target: nodes.find((n) => n.id === d.target_id) as CustomNode,
        curvature,
      }
    })

    const myColors = [COLORS.green]
    const color = d3.scaleOrdinal(types, myColors)

    const largeGraph = nodes.length > 20

    const simulation = d3
      .forceSimulation<CustomNode>(nodes) // Ensure simulation is initialized with CustomNode type
      .alphaDecay(largeGraph ? 0.5 : defaultAlphaDecay)
      .force(
        "link",
        d3
          .forceLink<CustomNode, CustomLink>(links) // Assuming CustomLink is your link type
          .id((d: SimulationNodeDatum, i?: number, nodesData?: SimulationNodeDatum[]) => {
            // Use type assertion here to tell TypeScript that `d` is indeed a CustomNode
            return (d as CustomNode).id
          })
          .distance(sizes.distance),
      )
      .force("charge", d3.forceManyBody().strength(sizes.chargeStrength))
      .force("collision", d3.forceCollide().radius((sizes.distance * 2) / nodes.length))
      .force("center", d3.forceCenter(0, 0))
      .force("x", d3.forceX())
      .force("y", d3.forceY())

    // Link curves
    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-width", sizes.linkWidth)
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("id", (d) => `link-${d.source.id}-${d.target.id}`)
      .attr("stroke", (d) => (d.type === "User Message" ? COLORS.red : COLORS.green))
      .attr("opacity", (d) => (d.highlight ? 1 : 0.5))
      .attr("marker-end", (d) => `url(${new URL(`#arrow-${d.type}`, location.href)})`)
      .style("cursor", "pointer")
      .on("click", function (event, d) {
        navigate(`/message/${d.id}`)
      })
      .on("mouseover", function (event, d) {
        svg
          .select(`#${CSS.escape(`link-text-${d.source.id}-${d.target.id}`)}`)
          .attr("visibility", "visible")
      })
      .on("mouseout", function (event, d) {
        svg
          .select(`#${CSS.escape(`link-text-${d.source.id}-${d.target.id}`)}`)
          .attr("visibility", "hidden")
      })

    // Node circles
    svg
      .append("defs")
      .selectAll("marker")
      .data(types)
      .join("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", sizes.arrowDistance)
      .attr("refY", 0)
      .attr("markerWidth", sizes.arrowWidth)
      .attr("markerHeight", sizes.arrowWidth)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", (d) => (d === "User Message" ? COLORS.red : color(d)))
      .attr("d", "M0,-5L10,0L0,5")

    const node = svg
      .append("g")
      .attr("fill", "currentColor")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll<SVGGElement, CustomNode>("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(drag(simulation, largeGraph))

    // Nodes
    node
      .append("circle")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("r", sizes.nodeRadius)
      .attr("fill", (d) => {
        if (d.label === "This Process") return COLORS.blue
        else if (d.label.startsWith("Process")) return COLORS.lightRed
        else if (d.label === "User") return COLORS.red
        else if (d.label.startsWith("User")) return COLORS.green
        return "black"
      })

    // Add text to the nodes
    node
      .append("text")
      .text((d) => d.label)
      .attr("x", 0)
      .attr("y", 60)
      .style("font-size", sizes.fontSize)
      .style("font-weight", "bold")
      .style("paint-order", "stroke")
      .style("fill", "var(--mui-palette-text-primary)")
      .style("stroke", "var(--mui-palette-background-paper)")
      .style("stroke-width", "4px")
      .attr("visibility", "hidden") // Initially hide the text
      .style("pointer-events", "none") // Ensure the text doesn't interfere with mouse events

    // Add text to links
    const linkText = svg
      .append("g")
      .attr("class", "link-texts")
      .selectAll("text")
      .data(links)
      .join("text")
      .attr("id", (d) => `link-text-${d.source.id}-${d.target.id}`)
      .style("font-size", sizes.fontSize)
      .style("font-weight", "bold")
      .style("paint-order", "stroke")
      .style("fill", "var(--mui-palette-text-primary)")
      .style("stroke", "var(--mui-palette-background-paper)")
      .style("stroke-width", "4px")
      .attr("visibility", "hidden") // Initially hide the text
      .style("pointer-events", "none") // Ensure the text doesn't interfere with mouse events
      .text((d) => d.action) // Use the 'action' property for labeling

    node
      .on("mouseover", function () {
        d3.select(this).select("text").style("visibility", "visible")
      })
      .on("mouseout", function () {
        d3.select(this).select("text").style("visibility", "hidden")
      })
      .on("click", function (event, d) {
        navigate(`/entity/${d.id}`)
      })

    simulation.on("tick", () => {
      link.attr("d", linkArc)
      node.attr("transform", (d) => `translate(${d.x},${d.y})`)
      linkText
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2)
    })

    // center the first node
    if (nodes[0]) {
      nodes[0].fx = 0
      nodes[0].fy = 0
    }

    // invalidation.then(() => simulation.stop());
    // Clean up the effect
    const svgRefSaved = svgRef.current

    return () => {
      while (svgRefSaved?.firstChild) {
        svgRefSaved.firstChild.remove()
      }
      // Stop the simulation or any intervals/timers here
      simulation.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]) // Re-run the effect when 'chartData' data changes

  return <svg ref={svgRef}></svg>
}

export const Graph = memo(BaseGraph)
