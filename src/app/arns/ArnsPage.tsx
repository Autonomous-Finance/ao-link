"use client"

import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material"
import { ArrowUpRight } from "@phosphor-icons/react"
import React, { Fragment } from "react"
import PageWrapper from "@/components/PageWrapper"

import { ArnsTable } from "./ArnsTable"
import PageSkeleton from "@/components/PageSkeleton"
import ErrorView from "@/components/ErrorView"
import { useArnsRecordsPaginated } from "@/hooks/useArnsRecordsPaginated"
import { Subheading } from "@/components/Subheading"

export default function ArnsPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useArnsRecordsPaginated(100)

  // Flatten all pages into a single array
  const allRecords = data?.pages.flatMap(page => page.items) ?? []
  const totalItems = data?.pages[0]?.totalItems ?? 0

  if (isError) return <ErrorView message={error?.message} />

  const content = (
    <Stack component="main" gap={2} paddingY={4}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Subheading type="ArNS Records" value={totalItems > 0 ? totalItems : undefined} />
        <Button
          variant="text"
          size="small"
          endIcon={<ArrowUpRight size={14} />}
          href="https://arns.ar.io"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'text.secondary' }}
        >
          Get your name
        </Button>
      </Stack>
      
      <Box sx={{ marginX: -2 }}>
        {isLoading ? (
          <PageSkeleton />
        ) : (
          <Fragment>
            <ArnsTable data={allRecords} />
            
            {/* Load More Button */}
            {hasNextPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  startIcon={isFetchingNextPage ? <CircularProgress size={16} /> : undefined}
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More Records'}
                </Button>
              </Box>
            )}
          </Fragment>
        )}
      </Box>
    </Stack>
  )

  return <PageWrapper>{content}</PageWrapper>
}
