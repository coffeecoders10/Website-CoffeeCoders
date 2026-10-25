'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha, SxProps, Theme } from '@mui/material/styles';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import CoffeeIcon, { CoffeeIconType } from './CoffeeIcon';

export interface ContentCardProps {
  title: string;
  body?: string;
  /** Makes the whole card a real link that opens in a new tab */
  href?: string;
  /** Fallback for non-link actions; the card becomes a keyboard-reachable button */
  onCtaClick?: () => void;
  /** Which coffee vessel to show: a name from COFFEE_ICON_TYPES, or a number that cycles through them */
  icon?: CoffeeIconType | number;
  sx?: SxProps<Theme>;
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function ContentCard({
  title,
  body,
  href,
  onCtaClick,
  icon = 'mug',
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

  // Hover effects are keyed off a data attribute that only a real mouse can set. CSS :hover and
  // (hover: hover) both fire on touch in some browsers (tap-and-hold, emulators), so we don't trust them.
  const onPointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse') e.currentTarget.dataset.hover = 'true';
  };
  const onPointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    delete e.currentTarget.dataset.hover;
  };
  // The lamp-light follows the pointer through CSS variables, so moving the mouse never re-renders React
  const trackPointer = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <Box
      {...interactiveProps}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerLeave}
      onPointerMove={trackPointer}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 4,
        color: 'inherit',
        background: (theme) =>
          `linear-gradient(160deg, ${alpha(theme.palette.background.surface, 0.34)} 0%, ${alpha(theme.palette.background.surface, 0.08)} 100%)`,
        border: '1px solid',
        borderColor: 'divider',
        transition: `transform 0.45s ${EASE}, box-shadow 0.45s ${EASE}, border-color 0.45s ${EASE}`,
        cursor: interactive ? 'pointer' : 'default',
        WebkitTapHighlightColor: 'transparent',

        // Lamp-light: a warm pool of light under the cursor, like a café table lamp at night
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0,
          background:
            'radial-gradient(380px circle at var(--mx, 50%) var(--my, 0%), rgba(105,53,25,0.14), rgba(73,42,23,0.06) 45%, transparent 72%)',
          transition: `opacity 0.5s ${EASE}`,
          pointerEvents: 'none',
        },

        '& .card-go': { transition: `color 0.35s ${EASE}` },
        '& .go-arrow': { transition: `transform 0.4s ${EASE}` },
        '& .steam-wisp': { opacity: 0, transition: `opacity 0.35s ${EASE}` },

        '&[data-hover="true"]': {
          transform: interactive ? 'translateY(-4px)' : 'none',
          borderColor: 'secondary.light',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(161,103,69,0.12)',
          '&::before': { opacity: 1 },
          '& .coffee-ring': { opacity: 0.22, transform: 'rotate(4deg) scale(1.06)' },
          '& .card-go': { color: 'primary.main' },
          '& .go-arrow': { transform: 'translate(2px, -4px)' },
          '& .steam-wisp': { opacity: 0.9 },
        },
        '&:focus-visible::before': { opacity: 1 },
        '&:focus-visible .coffee-ring': { opacity: 0.22 },
        '&:focus-visible .card-go': { color: 'primary.main' },
        '&:focus-visible .go-arrow': { transform: 'translate(2px, -4px)' },
        '&:focus-visible .steam-wisp': { opacity: 0.9 },
        '&[data-hover="true"]:active': interactive
          ? { transform: 'scale(0.985)', transition: `transform 0.12s ${EASE}` }
          : undefined,
        ...sx,
      }}
    >
      {/* Coffee-ring stain: the mark a mug leaves behind. Settles in a little darker on hover. */}
      <Box
        className="coffee-ring"
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: -46,
          right: -46,
          width: 150,
          height: 150,
          zIndex: -1,
          pointerEvents: 'none',
          borderRadius: '52% 48% 50% 50% / 50% 54% 46% 50%',
          border: '5px solid',
          borderColor: 'primary.main',
          opacity: 0.1,
          transform: 'rotate(-8deg)',
          transition: `opacity 0.6s ${EASE}, transform 0.8s ${EASE}`,
          // A thinner second ring, slightly off-centre, like a mug set down twice
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 9,
            borderRadius: 'inherit',
            border: '1.5px solid',
            borderColor: 'primary.main',
            opacity: 0.7,
            transform: 'translate(3px, -2px)',
          },
        }}
      />

      {/* Card icon: the vessel is always there, the steam fades in on hover */}
      <Box className="card-go" aria-hidden="true" sx={{ color: 'primary.light', lineHeight: 0, mb: 0.5 }}>
        <CoffeeIcon type={icon} />
      </Box>

      <Typography
        variant="h6"
        component="h3"
        sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.2rem', md: '1.3rem' }, lineHeight: 1.25 }}
      >
        {title}
      </Typography>

      {body && (
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
          {body}
        </Typography>
      )}

      {interactive && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            mt: 'auto',
            pt: 2,
            // A dashed rule, like the tear line on a café receipt
            borderTop: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <NorthEastIcon
            className="go-arrow"
            aria-hidden="true"
            sx={{ fontSize: '1.5rem', color: 'primary.main' }}
          />
        </Box>
      )}
    </Box>
  );
}
