'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { SxProps, Theme } from '@mui/material/styles';

export interface ContentCardProps {
  tag?: string;
  title: string;
  body?: string;
  cta?: string;
  onCtaClick?: () => void;
  sx?: SxProps<Theme>;
}

export default function ContentCard({
  tag,
  title,
  body,
  cta,
  onCtaClick,
  sx,
}: ContentCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '4px solid',
        borderLeftColor: 'primary.main',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 24px rgba(161,103,69,0.15)' },
        ...sx,
      }}
    >
      {tag && (
        <Chip
          label={tag}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ alignSelf: 'flex-start' }}
        />
      )}
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
          sx={{ alignSelf: 'flex-start', px: 0, mt: 'auto', color: 'primary.light' }}
        >
          {cta} →
        </Button>
      )}
    </Box>
  );
}
