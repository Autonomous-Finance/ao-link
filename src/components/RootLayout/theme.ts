import { colors } from "@mui/material"
import { experimental_extendTheme as extendTheme } from "@mui/material/styles"

import { MainFontFF, MonoFontFF } from "./fonts"

const extraColors = {
  red: colors.red[200],
  blue: colors.blue[200],
  green: colors.green[200],
  lime: colors.lime[200],
  yellow: colors.yellow[200],
  purple: colors.purple[200],
  indigo: colors.indigo[200],
  cyan: colors.cyan[200],
  pink: colors.pink[200],
  orange: colors.orange[200],
}

export const theme = extendTheme({
  breakpoints: {
    values: {
      xs: 0,      // phones (portrait)
      sm: 600,    // phones (landscape) / small tablets
      md: 900,    // tablets
      lg: 1200,   // laptop
      xl: 1536,   // large desktop
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: "rgb(220,220,220)",
        },
        secondary: {
          main: "rgb(230,230,230)",
        },
        // @ts-ignore
        accent: {
          main: "rgba(41, 204, 0, 1)",
        },
        background: {
          paper: "#252424",
          default: "rgb(24, 25, 26)",
        },
        ...extraColors,
      },
    },
    light: {
      palette: {
        primary: {
          main: "rgb(50, 50, 50)",
        },
        secondary: {
          main: "rgb(40,40,40)",
        },
        // @ts-ignore
        accent: {
          main: "rgba(41, 204, 0, 1)",
        },
        background: {
          default: "rgb(255,255,255)",
          paper: "#f9f9f9",
        },
        text: {
          secondary: "#9EA2AA",
        },
        ...extraColors,
      },
    },
  },
  typography: {
    fontFamily: MainFontFF,
  },
  components: {
    MuiCircularProgress: {
      defaultProps: {
        disableShrink: true,
      },
    },
    MuiTooltip: {
      defaultProps: {
        placement: "top",
        disableInteractive: true,
        enterDelay: 0,
        leaveDelay: 0,
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          fontSize: "0.9rem",
          textAlign: "center",
          maxWidth: 400,
          fontFamily: MonoFontFF,
        },
      },
    },
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
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "12px 8px !important",
          minHeight: "unset !important",
          minWidth: "unset !important",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "unset !important",
          marginTop: "-12px",
          marginLeft: "-8px",
        },
        flexContainer: {
          gap: "16px",
        },
        // indicator: {
        //   opacity: 0.25,
        //   height: "100%",
        // },
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& fieldset": {
            borderWidth: "1px !important",
          },
        },
      },
    },
    MuiTableRow: {
      defaultProps: {
        hover: true,
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "0.8125rem",
          paddingTop: "10px",
          paddingBottom: "10px",
        },
        body: {
          border: 0,
          paddingLeft: "16px",
          paddingRight: "16px",
          fontFamily: MonoFontFF,
        },
        head: {
          fontWeight: 700,
        },
      },
    },
  },
  shape: {
    borderRadius: 0,
  },
})
