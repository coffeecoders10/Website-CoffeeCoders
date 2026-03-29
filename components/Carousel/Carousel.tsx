'use client';

import { useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { SxProps, Theme } from '@mui/material/styles';

interface CarouselProps {
  /** Slide content — each element is one slide */
  slides: ReactNode[];
  /**
   * continuous — auto-plays with a marquee-style loop, no manual controls shown by default
   * interaction — manual prev/next controls, optional autoplay
   */
  mode?: 'continuous' | 'interaction';
  /** Auto-advance interval in ms (interaction mode). 0 = disabled */
  autoplayInterval?: number;
  /** How long the full continuous loop takes in ms */
  continuousDuration?: number;
  /** Show dot indicators (interaction mode) */
  showDots?: boolean;
  /** Show arrow buttons (interaction mode) */
  showArrows?: boolean;
  /** Pixel gap between slides */
  gap?: number;
  sx?: SxProps<Theme>;
}

// ─── Continuous Carousel ─────────────────────────────────────────────────────

function ContinuousCarousel({
  slides,
  continuousDuration = 20000,
  gap = 24,
  sx,
}: Pick<CarouselProps, 'slides' | 'continuousDuration' | 'gap' | 'sx'>) {
  // Duplicate slides for seamless loop
  const doubled = [...slides, ...slides];

  return (
    <Box sx={{ overflow: 'hidden', ...sx }}>
      <Box
        sx={{
          display: 'flex',
          gap: `${gap}px`,
          width: 'max-content',
          animation: `carouselScroll ${continuousDuration}ms linear infinite`,
          '@keyframes carouselScroll': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: `translateX(calc(-50% - ${gap / 2}px))` },
          },
          '&:hover': { animationPlayState: 'paused' },
        }}
      >
        {doubled.map((slide, i) => (
          <Box key={i} sx={{ flexShrink: 0 }}>
            {slide}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Interaction Carousel ─────────────────────────────────────────────────────

function InteractionCarousel({
  slides,
  autoplayInterval = 0,
  showDots = true,
  showArrows = true,
  gap = 0,
  sx,
}: Pick<
  CarouselProps,
  'slides' | 'autoplayInterval' | 'showDots' | 'showArrows' | 'gap' | 'sx'
>) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length]
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [slides.length]
  );

  // Autoplay
  useEffect(() => {
    if (!autoplayInterval) return;
    timerRef.current = setInterval(next, autoplayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, autoplayInterval]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, ...sx }}>
      {/* Slide viewport */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            gap: `${gap}px`,
            transform: `translateX(calc(-${current * 100}% - ${current * gap}px))`,
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {slides.map((slide, i) => (
            <Box key={i} sx={{ minWidth: '100%', flexShrink: 0 }}>
              {slide}
            </Box>
          ))}
        </Box>

        {/* Arrows */}
        {showArrows && (
          <>
            <IconButton
              onClick={prev}
              aria-label="Previous slide"
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.default',
                boxShadow: 2,
                '&:hover': { bgcolor: 'background.default' },
                zIndex: 1,
              }}
            >
              ‹
            </IconButton>
            <IconButton
              onClick={next}
              aria-label="Next slide"
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'background.default',
                boxShadow: 2,
                '&:hover': { bgcolor: 'background.default' },
                zIndex: 1,
              }}
            >
              ›
            </IconButton>
          </>
        )}
      </Box>

      {/* Dots */}
      {showDots && slides.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {slides.map((_, i) => (
            <Box
              key={i}
              onClick={() => setCurrent(i)}
              sx={{
                width: i === current ? 20 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: i === current ? 'primary.main' : 'action.disabled',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export default function Carousel({
  slides,
  mode = 'interaction',
  autoplayInterval = 0,
  continuousDuration = 20000,
  showDots = true,
  showArrows = true,
  gap = 0,
  sx,
}: CarouselProps) {
  if (mode === 'continuous') {
    return (
      <ContinuousCarousel
        slides={slides}
        continuousDuration={continuousDuration}
        gap={gap || 24}
        sx={sx}
      />
    );
  }

  return (
    <InteractionCarousel
      slides={slides}
      autoplayInterval={autoplayInterval}
      showDots={showDots}
      showArrows={showArrows}
      gap={gap}
      sx={sx}
    />
  );
}
