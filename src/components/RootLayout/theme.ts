import { experimental_extendTheme as extendTheme } from "@mui/material/styles"

import { MainFontFF } from "./fonts"

export const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: "rgb(220,220,220)",
        },
        secondary: {
          main: "rgb(190,190,190)",
        },
        background: {
          paper: "#252424",
          default: "rgb(24, 25, 26)",
        },
      },
    },
    light: {
      palette: {
        primary: {
          main: "rgb(180, 180, 180)",
        },
        secondary: {
          main: "rgb(230, 230, 230)",
        },
        background: {
          default: "rgb(255,255,255)",
          paper: "#f9f9f9",
        },
        text: {
          secondary: "#9EA2AA",
        },
      },
    },
  },
  typography: {
    fontFamily: MainFontFF,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // textTransform: "none",
          boxShadow: "none !important",
          "&:active": {
            transform: "scale(0.98)",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          borderRadius: "5px",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
})