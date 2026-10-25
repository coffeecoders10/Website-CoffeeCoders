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
  /** Y offset to animate from (px). Defaults to 20 */
  offsetY?: number;
  /** Trigger on mount only (ignores scroll). Defaults to false */
  onLoadOnly?: boolean;
  sx?: SxProps<Theme>;
}

export default function FadeIn({
  children,
  delay = 0,
  duration = 700,
  offsetY = 20,
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
      // Fire as soon as a sliver enters so tall mobile sections never wait on a 15% threshold
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' }
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
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
        '@media (prefers-reduced-motion: reduce)': {
          opacity: 1,
          transform: 'none',
          transition: 'none',
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
