"use client"

import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material"
import { ArrowUpRight } from "@phosphor-icons/react"
import { Fragment } from "react"

import { ArnsTable } from "./ArnsTable"
import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import { Subheading } from "@/components/Subheading"
import { useArnsRecordsPaginated } from "@/hooks/useArnsRecordsPaginated"

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

  if (isError) {
    return (
      <Stack component="main" gap={2} paddingY={4}>
        <Typography color="error">
          Error loading ArNS records: {error?.message}
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack component="main" gap={2} paddingY={4}>
      {/* Call to Action */}
      <Box 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          border: '2px solid',
          borderColor: 'primary.main',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)'
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" gutterBottom>
              Own Your Web3 Identity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register your own ArNS name and get a permanent, decentralized domain
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowUpRight size={16} />}
            href="https://arns.ar.io"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ minWidth: 140 }}
          >
            Get Your Name
          </Button>
        </Stack>
      </Box>

      <Subheading type="ArNS Records" value={totalItems > 0 ? totalItems : undefined} />
      
      <Box sx={{ marginX: -2 }}>
        {isLoading ? (
          <LoadingSkeletons />
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
}
