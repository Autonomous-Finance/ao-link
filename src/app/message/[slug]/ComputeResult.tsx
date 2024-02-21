"use client"

import React, { useCallback, useState } from "react"

type ComputeResultProps = {
  messageId: string
  processId: string
}

export function ComputeResult(props: ComputeResultProps) {
  const { messageId, processId } = props
  const [content, setContent] = useState("")

  const handleCompute = useCallback(async () => {
    try {
      const result = await fetch(
        `https://cu.ao-testnet.xyz/result/${messageId}?process-id=${processId}`,
      )
      const json = await result.json()
      setContent(json.Output.data.output)
    } catch (error) {
      setContent(`Error computing result: ${String(error)}`)
    }
  }, [messageId, processId])

  return (
    <div>
      <div className="mb-2">
        <div className="flex flex-row items-baseline w-full">
          <div className="flex w-56 items-center">
            <p className="table-headers">Compute Result</p>
          </div>
          <button className="btn btn-sm" onClick={handleCompute}>
            Compute
          </button>
        </div>
      </div>
      <div className="bg-secondary-gray w-96 min-h-14 flex items-start justify-start">
        <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2">
          {content ? content : "Waiting to compute..."}
        </p>
      </div>
    </div>
  )
}
