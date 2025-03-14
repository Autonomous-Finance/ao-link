import { Box, Stack } from "@mui/material"
import React, { SVGProps } from "react"

import { MonoFontFF } from "./RootLayout/fonts"

export function GoldSkyLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g filter="url(#filter0_iii_772_53)">
          <g clipPath="url(#clip0_772_53)">
            <circle cx="12" cy="12" r="12" fill="url(#paint0_radial_772_53)" />
            <g filter="url(#filter1_d_772_53)">
              <path
                d="M5 12C5 8.13401 8.13401 5 12 5V5C15.866 5 19 8.13401 19 12V12H5V12Z"
                fill="white"
              />
            </g>
            <path
              d="M5 12H19V12C19 15.866 15.866 19 12 19V19C8.13401 19 5 15.866 5 12V12Z"
              fill="url(#paint1_radial_772_53)"
              fillOpacity="0.66"
            />
            <g filter="url(#filter2_i_772_53)">
              <path
                d="M0 12C0 5.37258 5.37258 0 12 0V0C18.6274 0 24 5.37258 24 12V12H0V12Z"
                fill="white"
                fillOpacity="0.2"
              />
            </g>
          </g>
        </g>
        <defs>
          <filter
            id="filter0_iii_772_53"
            x="0"
            y="-2"
            width="24"
            height="28"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="-1" />
            <feGaussianBlur stdDeviation="0.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 0.843137 0 0 0 0 0.501961 0 0 0 0.25 0"
            />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_772_53" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="-2" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.958333 0 0 0 0 0 0 0 0 0 3.42727e-07 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_innerShadow_772_53"
              result="effect2_innerShadow_772_53"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="3" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0" />
            <feBlend
              mode="normal"
              in2="effect2_innerShadow_772_53"
              result="effect3_innerShadow_772_53"
            />
          </filter>
          <filter
            id="filter1_d_772_53"
            x="2"
            y="2"
            width="20"
            height="13"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_772_53" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_772_53"
              result="shape"
            />
          </filter>
          <filter
            id="filter2_i_772_53"
            x="0"
            y="0"
            width="24"
            height="16"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_772_53" />
          </filter>
          <radialGradient
            id="paint0_radial_772_53"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(12 24) rotate(-90) scale(24 38.6375)"
          >
            <stop stopColor="#FE5117" />
            <stop offset="1" stopColor="#FFC61C" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_772_53"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(12 12) rotate(90) scale(7 14)"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#D9D9D9" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <clipPath id="clip0_772_53">
            <rect width="24" height="24" rx="12" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <Box
        component="span"
        sx={{
          textTransform: "uppercase",
          fontFamily: MonoFontFF,
          fontWeight: 500,
        }}
      >
        goldsky.com
      </Box>
    </Stack>
  )
}
