'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

export interface StatCardProps {
  label: string;
  value: string | number;
  /** e.g. "+12%" */
  trend?: string;
  trendDirection?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function StatCard({
  label,
  value,
  trend,
  trendDirection = 'neutral',
  icon,
  sx,
}: StatCardProps) {
  const trendColor =
    trendDirection === 'positive'
      ? 'success.main'
      : trendDirection === 'negative'
      ? 'error.main'
      : 'text.secondary';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        ...sx,
      }}
    >
      {icon && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: 'secondary.dark',
            color: 'primary.light',
            flexShrink: 0,
            fontSize: 22,
            border: '1px solid',
            borderColor: 'primary.dark',
          }}
        >
          {icon}
        </Box>
      )}
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          {value}
        </Typography>
        {trend && (
          <Typography variant="caption" color={trendColor} fontWeight={600}>
            {trend}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
