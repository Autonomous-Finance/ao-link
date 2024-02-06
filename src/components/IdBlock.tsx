"use client"

import { truncateId } from "@/utils/data-utils"
import { Check, Copy } from "@phosphor-icons/react"
import { tree } from "d3"
import React from "react"

type IdBlockProps = {
  value: string
}

export function IdBlock(props: IdBlockProps) {
  const { value } = props

  const [copied, setCopied] = React.useState(false)

  return (
    <span className="tooltip" data-tip={copied ? "Copied to clipboard" : value}>
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
        {truncateId(value)}
        {copied ? (
          <Check className="inline-block ml-1"  size={14} />
        ) : (
          <Copy className="inline-block ml-1" fill="inherit" size={14} />
        )}
      </span>
    </span>
  )
}
