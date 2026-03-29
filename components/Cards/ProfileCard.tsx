'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material/styles';
import Image from 'next/image';

export interface ProfileCardProps {
  avatarSrc?: string;
  name: string;
  role?: string;
  bio?: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  }[];
  sx?: SxProps<Theme>;
}

export default function ProfileCard({
  avatarSrc,
  name,
  role,
  bio,
  actions,
  sx,
}: ProfileCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1,
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          overflow: 'hidden',
          bgcolor: 'secondary.dark',
          border: '2px solid',
          borderColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {avatarSrc ? (
          <Image src={avatarSrc} alt={name} fill style={{ objectFit: 'cover' }} />
        ) : (
          <Typography variant="h5" sx={{ color: 'primary.contrastText', fontWeight: 700 }}>
            {name.charAt(0).toUpperCase()}
          </Typography>
        )}
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={700} color="text.primary">
          {name}
        </Typography>
        {role && (
          <Typography variant="body2" color="text.secondary">
            {role}
          </Typography>
        )}
      </Box>
      {bio && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {bio}
        </Typography>
      )}
      {actions && actions.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {actions.map((action, i) => (
            <Button
              key={i}
              variant={action.variant ?? 'contained'}
              size="small"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
