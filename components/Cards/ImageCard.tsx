'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';

export interface ImageCardProps {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  aspectRatio?: string;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export default function ImageCard({
  src,
  alt,
  title,
  subtitle,
  aspectRatio = '4/3',
  onClick,
  sx,
}: ImageCardProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        aspectRatio,
        borderRadius: 2,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover .overlay': { opacity: 1 },
        ...sx,
      }}
    >
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />
      <Box
        className="overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(13,13,13,0.85) 0%, transparent 60%)',
          opacity: 0.75,
          transition: 'opacity 0.3s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.primary', lineHeight: 1.2 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
