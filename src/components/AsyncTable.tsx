import {
  CircularProgress,
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
    renderRow: (row: any) => React.ReactNode
    initialSortField: string
    initialSortDir: "asc" | "desc"
    fetchFunction: (
      offset: number,
      ascending: boolean,
      sortField: string,
      lastRecord?: any,
    ) => Promise<any[]>
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
    ...rest
  } = props

  const isFirstFetch = useRef(true)
  const loaderRef = useRef(null)
  const listSizeRef = useRef(0)
  const [data, setData] = useState<any[]>([])

  const [endReached, setEndReached] = useState(false)

  const [sortAscending, setSortAscending] = useState<boolean>(
    initialSortDir === "asc",
  )
  const [sortField, setSortField] = useState<string>(initialSortField)

  useEffect(() => {
    if (endReached) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          console.log("Intersecting - Fetching more data")
          fetchFunction(
            listSizeRef.current,
            sortAscending,
            sortField,
            data[data.length - 1],
          ).then((newPage) => {
            console.log(`Fetched another page of ${newPage.length} records`)

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
  }, [data.length, endReached, pageSize, sortAscending, sortField])

  useEffect(() => {
    fetchFunction(0, sortAscending, sortField, undefined).then((newPage) => {
      setData(newPage)
      listSizeRef.current = newPage.length
      setEndReached(newPage.length < pageSize)
      isFirstFetch.current = false
    })
  }, [fetchFunction, sortAscending, sortField, pageSize])

  if (isFirstFetch.current) return <LoadingSkeletons />

  return (
    <Stack component={component || "div"}>
      <Table {...rest}>
        <TableHead>
          <TableRow hover={false}>
            {headerCells.map((cell, index) => (
              <TableCell
                key={index}
                align={cell.align}
                sx={{
                  color: "#9ea2aa",
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
          {data.map(renderRow)}
          {data.length === 0 && endReached && (
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
      {!endReached && data.length > 0 && (
        <Stack
          marginY={1.5}
          marginX={2}
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
