'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha, SxProps, Theme } from '@mui/material/styles';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface ContentCardProps {
  title: string;
  body?: string;
  cta?: string;
  /** Makes the whole card a real link that opens in a new tab */
  href?: string;
  /** Fallback for non-link actions; the card becomes a keyboard-reachable button */
  onCtaClick?: () => void;
  sx?: SxProps<Theme>;
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function ContentCard({
  title,
  body,
  cta,
  href,
  onCtaClick,
  sx,
}: ContentCardProps) {
  const interactive = Boolean(href || onCtaClick);

  const interactiveProps = href
    ? { component: 'a', href, target: '_blank', rel: 'noopener noreferrer' }
    : onCtaClick
      ? {
          role: 'button',
          tabIndex: 0,
          onClick: onCtaClick,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onCtaClick();
            }
          },
        }
      : {};

  return (
    <Box
      {...interactiveProps}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: { xs: 2.5, md: 3 },
        borderRadius: 5,
        color: 'inherit',
        bgcolor: (theme) => alpha(theme.palette.background.surface, 0.2),
        border: '2px solid',
        borderColor: 'divider',
        transition: `box-shadow 0.35s ${EASE}, transform 0.35s ${EASE}, border-color 0.35s ${EASE}`,
        cursor: interactive ? 'pointer' : 'default',
        WebkitTapHighlightColor: 'transparent',
        // Hover styles only where hover exists, so taps on phones don't leave a card stuck lit
        '@media (hover: hover)': {
          '&:hover': {
            transform: interactive ? 'translateY(-4px)' : 'none',
            boxShadow: '0 8px 32px rgba(161,103,69,0.18)',
            borderColor: 'secondary.light',
            '& .bg-icon': {
              top: '50%',
              left: '80%',
              transform: 'translate(-50%, -50%) scale(4.5)',
              opacity: 0.1,
            },
            '& .cta-arrow': { transform: 'translateX(4px)' },
          },
        },
        '&:active': interactive
          ? { transform: 'scale(0.985)', transition: `transform 0.12s ${EASE}` }
          : undefined,
        ...sx,
      }}
    >
      <LocalCafeOutlinedIcon
        className="bg-icon"
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '-20px',
          left: '-50px',
          transform: 'scale(2)',
          fontSize: '2.5rem',
          color: 'primary.main',
          opacity: 0.25,
          transition: `top 0.6s ${EASE}, left 0.6s ${EASE}, transform 0.6s ${EASE}, opacity 0.6s ${EASE}`,
          pointerEvents: 'none',
        }}
      />

      <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ position: 'relative' }}>
        {title}
      </Typography>
      {body && (
        <Typography variant="body2" color="text.secondary" sx={{ position: 'relative', lineHeight: 1.7 }}>
          {body}
        </Typography>
      )}
      {cta && (
        <Typography
          component="span"
          variant="button"
          sx={{
            position: 'relative',
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            mt: 'auto',
            pt: 1,
            color: 'primary.light',
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {cta}
          <ArrowForwardIcon
            className="cta-arrow"
            aria-hidden="true"
            sx={{ fontSize: '1.1rem', transition: `transform 0.35s ${EASE}` }}
          />
        </Typography>
      )}
    </Box>
  );
}
