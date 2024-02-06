"use client"

import { truncateId } from "@/utils/data-utils"
import Link from "next/link"
import React from "react"
import { CopyToClipboard } from "./CopyToClipboard"

type IdBlockProps = {
  value: string
  href?: string
}

export function IdBlock(props: IdBlockProps) {
  const { value, href } = props

  if (href) {
    return (
      <div>
        <Link href={href}>
          <span className="tooltip hover:underline" data-tip={value}>
            {truncateId(value)}
          </span>
        </Link>
        <CopyToClipboard value={value} />
      </div>
    )
  }

  return (
    <div>
      <span className="tooltip" data-tip={value}>
        {truncateId(value)}
      </span>
      <CopyToClipboard value={value} />
    </div>
  )
}
