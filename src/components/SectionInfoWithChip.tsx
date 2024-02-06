import React from "react"
import { Diamonds } from "./icons/Diamonds"
import { Asterisk } from "./icons/Asterisk"

export const SectionInfoWithChip = ({
  title,
  value,
}: {
  title: string
  value: string
}) => (
  <div className="flex flex-row items-baseline w-full mb-12">
    <div className="flex w-56 items-center">
      <p className="table-headers">{title}</p>
    </div>
    <div
      className={`flex min-w-[70px] py-1 px-2 space-x-1 items-center ${
        value.toLocaleLowerCase() === "process"
          ? "bg-[#FEEEE5]"
          : "bg-[#E2F0DC]"
      }`}
    >
      <p className="table-row hover:bg-transparent !h-auto">{value}</p>
      {value.toLocaleLowerCase() === "process" ? <Diamonds /> : <Asterisk />}
    </div>
  </div>
)
