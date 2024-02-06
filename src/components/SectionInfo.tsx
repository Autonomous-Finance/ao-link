import React from 'react'

export const SectionInfo = ({
  title,
  value,
}: {
  title: string
  value: React.ReactNode
}) => (
  <div className="flex flex-row items-baseline w-full mb-12">
    <div className="flex w-56 items-center">
      <p className="table-headers">{title}</p>
    </div>
    <div className="flex">
      <p className="table-row hover:bg-transparent !h-auto">{value}</p>
    </div>
  </div>
)
