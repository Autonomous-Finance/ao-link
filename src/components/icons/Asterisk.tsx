import React from "react"

export function Asterisk() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_55_199)">
        <path
          d="M4 6.75V1.25"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.5 5.5L6.5 2.5"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.5 2.5L6.5 5.5"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_55_199">
          <rect
            width="8"
            height="8"
            fill="white"
            transform="matrix(1 0 0 -1 0 8)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
