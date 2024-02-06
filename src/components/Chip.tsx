import React from 'react'

export const Chip = ({ text }: { text: string }) => {
  const colors = {
    red: "bg-red-300",
    blue: "bg-blue-300",
    green: "bg-green-300",
    lime: "bg-lime-300",
    yellow: "bg-yellow-300",
    purple: "bg-purple-300",
    indigo: "bg-indigo-300",
    cyan: "bg-cyan-300",
    pink: "bg-pink-300",
  }

  const pickRandomColor = () => {
    const colorsMap = Object.keys(colors)
    const index = Math.floor(Math.random() * colorsMap.length)
    return colorsMap[index]
  }

  const randomColor = pickRandomColor()
  const chipColor = `bg-${randomColor}-300`

  return (
    <span
      className={`m-1 inline-block px-3 py-1 rounded-full text-[#5d5d5d] ${chipColor}`}
    >
      {text}
    </span>
  )
}
