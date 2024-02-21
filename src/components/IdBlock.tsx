"use client"

import Link from "next/link"
import React from "react"

import { cn } from "@/utils/tailwind-utils"

import { CopyToClipboard } from "./CopyToClipboard"

type IdBlockProps = {
  label: string
  value?: string
  href?: string
}

export function IdBlock(props: IdBlockProps) {
  const { label, value, href } = props

  const tooltip = !!value
  const copyValue = value || label

  if (href) {
    return (
      <div className="fill-[#7d7d7d00] hover:fill-[#7d7d7d]">
        <Link
          href={href}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <span className={cn({ tooltip }, "hover:underline")} data-tip={value}>
            {label}
          </span>
        </Link>
        <CopyToClipboard value={copyValue} />
      </div>
    )
  }

  return (
    <div className="fill-[#7d7d7d00] hover:fill-[#7d7d7d]">
      <span className={cn({ tooltip })} data-tip={value}>
        {label}
      </span>
      <CopyToClipboard value={copyValue} />
    </div>
  )
}
