'use client';

import { useState, ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface GalleryGridProps {
  /** Items to render inside the grid cells */
  items: ReactNode[];
  /** Number of columns */
  columns?: number;
  /** Number of rows per page. If undefined, all items show at once */
  rows?: number;
  /** Enable pagination */
  pagination?: boolean;
  /** Render dots instead of page numbers */
  paginationDots?: boolean;
  /** Gap between cells */
  gap?: number | string;
  sx?: SxProps<Theme>;
}

export default function GalleryGrid({
  items,
  columns = 3,
  rows,
  pagination = false,
  paginationDots = false,
  gap = 2,
  sx,
}: GalleryGridProps) {
  const [page, setPage] = useState(0);

  const pageSize = pagination && rows ? columns * rows : items.length;
  const totalPages = Math.ceil(items.length / pageSize);
  const pageItems = pagination
    ? items.slice(page * pageSize, page * pageSize + pageSize)
    : items;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, ...sx }}>
      {/* Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: rows ? `repeat(${rows}, auto)` : undefined,
          gap,
        }}
      >
        {pageItems.map((item, i) => (
          <Box key={i}>{item}</Box>
        ))}
      </Box>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mt: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
          >
            ‹
          </IconButton>

          {paginationDots
            ? Array.from({ length: totalPages }).map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setPage(i)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: i === page ? 'primary.main' : 'action.disabled',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                />
              ))
            : Array.from({ length: totalPages }).map((_, i) => (
                <Typography
                  key={i}
                  onClick={() => setPage(i)}
                  variant="body2"
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    cursor: 'pointer',
                    fontWeight: i === page ? 700 : 400,
                    bgcolor: i === page ? 'primary.main' : 'transparent',
                    color: i === page ? 'primary.contrastText' : 'text.primary',
                    transition: 'all 0.2s',
                  }}
                >
                  {i + 1}
                </Typography>
              ))}

          <IconButton
            size="small"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            aria-label="Next page"
          >
            ›
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
