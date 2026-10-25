'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

export interface SectionHeaderProps {
  /** Short script phrase above the title, e.g. "Discover our" */
  eyebrow: string;
  title: string;
  align?: 'center' | 'left';
  sx?: SxProps<Theme>;
}

/** The site's section heading: script eyebrow over an uppercase h2. One scale everywhere. */
export default function SectionHeader({
  eyebrow,
  title,
  align = 'center',
  sx,
}: SectionHeaderProps) {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 4, md: 6 }, ...sx }}>
      <Typography
        component="p"
        aria-hidden="true"
        sx={{
          fontFamily: 'var(--font-tertiary)',
          fontSize: { xs: '1.75rem', md: '2.5rem' },
          color: 'text.dark',
          lineHeight: 1,
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '2rem', md: '3rem' },
          color: 'text.primary',
          mt: 0.5,
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: { xs: '0.01em', md: '0.02em' },
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
