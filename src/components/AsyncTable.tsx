import {
  Box,
  CircularProgress,
  LinearProgress,
  Stack,
  StackProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableProps,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material"
import React, { ReactNode, useEffect, useRef, useState } from "react"
import { FixedSizeList, ListChildComponentProps } from "react-window"

import { ErrorBoundary } from "./ErrorBoundary"
import { LoadingSkeletons } from "./LoadingSkeletons"

export type HeaderCell = {
  field?: string
  sortable?: boolean
  sx?: any
  label: ReactNode
  align?: "center" | "left" | "right"
}

export type AsyncTableProps = Omit<TableProps, "component"> &
  Pick<StackProps, "component"> & {
    headerCells: HeaderCell[]
    pageSize: number
    renderRow: (row: any, index: number) => React.ReactNode
    initialSortField: string
    initialSortDir: "asc" | "desc"
    fetchFunction: (
      offset: number,
      ascending: boolean,
      sortField: string,
      lastRecord?: any,
      extraFilters?: Record<string, string>,
    ) => Promise<any[]>
    extraFilters?: Record<string, string>
    virtualize?: boolean
  }

export function AsyncTable(props: AsyncTableProps) {
  const {
    pageSize,
    renderRow,
    headerCells,
    initialSortField,
    initialSortDir,
    fetchFunction,
    component,
    extraFilters,
    virtualize,
    ...rest
  } = props

  const isFirstFetch = useRef(true)
  const loaderRef = useRef(null)
  const listSizeRef = useRef(0)
  const [data, setData] = useState<any[]>([])

  const [endReached, setEndReached] = useState(false)

  const [sortAscending, setSortAscending] = useState<boolean>(initialSortDir === "asc")
  const [sortField, setSortField] = useState<string>(initialSortField)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (endReached) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log("Intersecting - Fetching more data")
          setLoading(true)
          fetchFunction(
            listSizeRef.current,
            sortAscending,
            sortField,
            data[data.length - 1],
            extraFilters,
          ).then((newPage) => {
            console.log(`Fetched another page of ${newPage.length} records`)

            setLoading(false)
            if (newPage.length === 0) {
              console.log("No more records to fetch")
              observer.disconnect()
              setEndReached(true)
              return
            }

            setData((prevData) => {
              const newList = [...prevData, ...newPage]
              listSizeRef.current = newList.length
              return newList
            })
            isFirstFetch.current = false
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, endReached, pageSize, sortAscending, sortField, extraFilters])

  useEffect(() => {
    setLoading(true)
    fetchFunction(0, sortAscending, sortField, undefined, extraFilters).then((newPage) => {
      setLoading(false)
      setData(newPage)
      listSizeRef.current = newPage.length
      setEndReached(newPage.length < pageSize)
      isFirstFetch.current = false
    })
  }, [fetchFunction, sortAscending, sortField, pageSize, extraFilters])

  if (isFirstFetch.current) return <LoadingSkeletons />

  return (
    <Stack component={component || "div"}>
      <Box sx={{ overflowX: "auto", width: "100%" }}>
        <Table
          {...rest}
          size="small"
          sx={{
            minWidth: { xs: "auto", md: 650 },
            "& .MuiTableCell-root": {
              paddingY: 0.75,
              fontSize: { xs: "0.75rem", sm: "0.8125rem" },
            },
            ...(rest.sx || {}),
          }}
        >
          <TableHead>
            <TableRow hover={false}>
            {headerCells.map((cell, index) => (
              <TableCell
                key={index}
                align={cell.align}
                sx={{
                  color: "#9ea2aa",
                  whiteSpace: "nowrap",
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
          {virtualize && data.length > pageSize * 3 ? (
            <VirtualRows
              data={data}
              rowRenderer={renderRow}
              rowHeight={44}
            />
          ) : (
            <>
              <TableRow hover={false}>
                <TableCell colSpan={99} sx={{ padding: 0, border: 0 }}>
                  {loading ? (
                    <LinearProgress color="primary" variant="indeterminate" sx={{ height: 2 }} />
                  ) : (
                    <Box sx={{ height: 2 }} />
                  )}
                </TableCell>
              </TableRow>
              {data.map((row, index) => (
                <ErrorBoundary key={row.id} fallback={<>Something went wrong</>}>
                  {renderRow(row, index)}
                </ErrorBoundary>
              ))}
              {data.length === 0 && endReached && (
                <TableRow hover={false}>
                  <TableCell colSpan={99} sx={{ padding: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      No data available.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
      </Box> {/* Close the Box component that wraps the Table */}
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

// virtual rows component
function VirtualRows<T>({
  data,
  rowRenderer,
  rowHeight,
}: {
  data: T[]
  rowRenderer: (row: T, idx: number) => React.ReactNode
  rowHeight: number
}) {
  const itemData = React.useMemo(() => ({ data, rowRenderer }), [data, rowRenderer])

  const Row = ({ index, style }: ListChildComponentProps) => {
    const { data, rowRenderer } = itemData as any
    return <div style={style}>{rowRenderer(data[index], index)}</div>
  }

  const height = Math.min(400, data.length * rowHeight)

  return (
    <FixedSizeList
      height={height}
      itemCount={data.length}
      itemSize={rowHeight}
      overscanCount={8}
      width="100%"
      itemData={itemData}
    >
      {Row}
    </FixedSizeList>
  )
}
