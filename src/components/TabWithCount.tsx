import { Chip, Fade, Tab, TabProps } from "@mui/material"
import React, { useEffect } from "react"

export function TabWithCount(props: TabProps & { chipValue?: number }) {
  const { chipValue, label, ...rest } = props

  const [show, setShow] = React.useState(false)

  /**
   * Use a delay because the current tick is busy rendering the table rows
   */
  useEffect(() => {
    if (chipValue !== undefined) {
      setTimeout(() => {
        setShow(true)
      }, 200)
    }
  }, [chipValue])

  return (
    <Tab
      sx={{
        flexDirection: "row",
        gap: 1,
      }}
      label={
        <>
          <span>{label}</span>
          {show && (
            <Fade in={show}>
              <Chip
                component="span"
                size="small"
                sx={{
                  marginY: -1,
                }}
                label={chipValue}
              />
            </Fade>
          )}
        </>
      }
      {...rest}
    />
  )
}
