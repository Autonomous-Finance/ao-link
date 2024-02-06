'use client'

import { transformLongText } from "@/utils/transformLongText"
import { tree } from "d3"
import React from "react"

type IdBlockProps = {
  value: string
}

export function IdBlock(props: IdBlockProps) {
  const { value } = props

  const [copied, setCopied] = React.useState(false)

  return (
    <span className="tooltip" data-tip={copied ? "Copied to clipboard":value}
    >
      <span
      className="hover:fill-[#000] cursor-pointer fill-[#7d7d7d]"
        onClick={() => {
          navigator.clipboard.writeText(value)

          setCopied(true)

          setTimeout(() => {
            setCopied(false)
          }, 1000)
        }}
        >
        {transformLongText(value)}
        {
          copied ? (
<svg className="inline-block ml-1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#000000" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
          ): (

            <svg
            className="inline-block ml-1"
            xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="inherit" viewBox="0 0 256 256"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg>
          )
        }
      </span>
    </span>
  )
}
