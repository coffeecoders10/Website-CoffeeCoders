'use client';

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

interface FadeInProps {
  children: React.ReactNode;
  /** Delay before animation starts in ms */
  delay?: number;
  /** Duration of animation in ms */
  duration?: number;
  /** Y offset to animate from (px). Defaults to 24 */
  offsetY?: number;
  /** Trigger on mount only (ignores scroll). Defaults to false */
  onLoadOnly?: boolean;
  sx?: SxProps<Theme>;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 1000,
  offsetY = 24,
  onLoadOnly = false,
  sx,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (onLoadOnly) {
      // Small timeout so the initial render paints before the animation kicks in
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onLoadOnly]);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${offsetY}px)`,
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
        willChange: 'opacity, transform',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
