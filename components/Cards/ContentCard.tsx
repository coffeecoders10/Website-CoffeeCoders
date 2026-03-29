'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { alpha, SxProps, Theme } from '@mui/material/styles';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';

export interface ContentCardProps {
  title: string;
  body?: string;
  cta?: string;
  onCtaClick?: () => void;
  sx?: SxProps<Theme>;
}

export default function ContentCard({
  title,
  body,
  cta,
  onCtaClick,
  sx,
}: ContentCardProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: 3,
        borderRadius: 5,
        bgcolor: (theme) => alpha(theme.palette.background.surface, 0.2),
        border: '2px solid',
        borderColor: 'divider',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: '0 4px 24px rgba(161,103,69,0.15)',
          '& .bg-icon': {
            top: '50%',
            left: '80%',
            transform: 'translate(-50%, -50%) scale(4.5)',
            opacity: 0.1,
          },
        },
        ...sx,
      }}
    >
      {/* Background icon */}
      <LocalCafeOutlinedIcon
        className="bg-icon"
        sx={{
          position: 'absolute',
          top: '-20px',
          left: '-50px',
          transform: 'scale(2)',
          fontSize: '2.5rem',
          color: 'primary.main',
          opacity: 0.25,
          transition: 'top 0.4s ease, left 0.4s ease, transform 0.4s ease, opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      <Typography variant="h6" fontWeight={700} color="text.primary">
        {title}
      </Typography>
      {body && (
        <Typography variant="body2" color="text.secondary">
          {body}
        </Typography>
      )}
      {cta && (
        <Button
          variant="text"
          size="small"
          onClick={onCtaClick}
          sx={{ alignSelf: 'flex-start', px: 0, mt: 'auto', color: 'primary.light', '&:hover': { opacity: '0.8', bgcolor: 'transparent' } }}
        >
          {cta} →
        </Button>
      )}
    </Box>
  );
}
