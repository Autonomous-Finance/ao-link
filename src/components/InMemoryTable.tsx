import {
  Box,
  CircularProgress,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableProps,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material"
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react"

export type HeaderCell = {
  field?: string
  sortable?: boolean
  sx?: any
  label: ReactNode
  align?: "center" | "left" | "right"
}

type InMemoryTableProps = TableProps & {
  headerCells: HeaderCell[]
  data: any[]
  /**
   * @default 30
   */
  pageSize?: number
  renderRow: (row: any) => React.ReactNode
  initialSortField: string
  initialSortDir: "asc" | "desc"
  loading?: boolean
}

export function InMemoryTable(props: InMemoryTableProps) {
  const {
    data,
    pageSize = 30,
    renderRow,
    headerCells,
    initialSortField,
    initialSortDir,
    loading,
    ...rest
  } = props

  const loaderRef = useRef(null)

  const [listSize, setListSize] = useState(pageSize)
  const [endReached, setEndReached] = useState(false)

  useEffect(() => {
    setListSize(pageSize)
    setEndReached(false)
  }, [data, pageSize])

  useEffect(() => {
    if (endReached) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log("Intersecting - Showing more data")
          setListSize((prev) => {
            if (prev + pageSize >= data.length) {
              setEndReached(true)
              return data.length
            }
            return prev + pageSize
          })
        } else {
          console.log("Not intersecting")
        }
      },
      { threshold: 1 },
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [data.length, endReached, pageSize])

  const [sortAscending, setSortAscending] = useState<boolean>(initialSortDir === "asc")
  const [sortField, setSortField] = useState<string>(initialSortField)

  const visibleRows = useMemo(
    () =>
      [...data]
        .sort((a, b) => {
          if (a[sortField] < b[sortField]) {
            return sortAscending ? -1 : 1
          }
          if (a[sortField] > b[sortField]) {
            return sortAscending ? 1 : -1
          }
          return 0
        })
        .slice(0, listSize),
    [data, listSize, sortAscending, sortField],
  )

  return (
    <Stack>
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Table size="small" {...rest}>
          <TableHead
          // sx={{ position: "sticky", top: 60 }}
          >
            <TableRow hover={false}>
              {headerCells.map((cell, index) => (
                <TableCell
                  key={index}
                  align={cell.align}
                  sx={{
                    color: "#9ea2aa",
                    // background: "var(--mui-palette-background-default)",
                    ...(cell.sx || {}),
                  }}
                >
                  {cell.sortable ? (
                    <TableSortLabel
                      active={sortField === cell.field}
                      direction={sortAscending ? "asc" : "desc"}
                      onClick={() => {
                        if (sortField !== cell.field) {
                          setSortField(cell.field as string)
                        } else {
                          setSortAscending(!sortAscending)
                        }
                      }}
                    >
                      {cell.label}
                    </TableSortLabel>
                  ) : (
                    cell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover={false}>
              <TableCell colSpan={99} sx={{ padding: 0, border: 0 }}>
                {loading ? (
                  <LinearProgress color="primary" variant="indeterminate" sx={{ height: 2 }} />
                ) : (
                  <Box sx={{ height: 2 }} />
                )}
              </TableCell>
            </TableRow>
            {visibleRows.map(renderRow)}
            {data.length === 0 && !loading && (
              <TableRow hover={false}>
                <TableCell colSpan={99} sx={{ padding: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No data available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      {!endReached && data.length > 0 && (
        <Stack
          paddingY={1.5}
          paddingX={2}
          ref={loaderRef}
          sx={{ width: "100%" }}
          direction="row"
          gap={1}
          alignItems="center"
        >
          <CircularProgress size={12} color="primary" />
          <Typography variant="body2" color="text.secondary">
            Loading more records...
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
