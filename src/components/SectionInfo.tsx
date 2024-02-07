import React from "react"

export const SectionInfo = ({
  title,
  value,
}: {
  title: string
  value: React.ReactNode
}) => (
  <div className="flex flex-row items-baseline w-full mb-12">
    <div className="flex w-56 items-center">
      <div className="table-headers">{title}</div>
    </div>
    <div className="flex">
      <div className="table-row hover:bg-transparent !h-auto">{value}</div>
    </div>
  </div>
)
