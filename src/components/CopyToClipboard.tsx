import { Check, Copy } from "@phosphor-icons/react"
import React from "react"

type CopyToClipboardProps = {
  value: string
}

export function CopyToClipboard(props: CopyToClipboardProps) {
  const { value } = props

  const [copied, setCopied] = React.useState(false)

  if(!value) return null

  return (
    <span
      data-tip={copied ? "Copied" : "Copy to clipboard"}
      className="hover:fill-[#000] cursor-pointer fill-[#7d7d7d] tooltip"
      onClick={() => {
        navigator.clipboard.writeText(value)

        setCopied(true)

        setTimeout(() => {
          setCopied(false)
        }, 1000)
      }}
    >
      {copied ? (
        <Check className="inline-block ml-1" size={14} />
      ) : (
        <Copy className="inline-block ml-1" fill="inherit" size={14} />
      )}
    </span>
  )
}
