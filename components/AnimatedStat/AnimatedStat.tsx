"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useCountUp(target: number, duration = 1600, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    // Reduced motion: collapse the count to a single frame
    const total = prefersReducedMotion() ? 1 : duration;
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startedAt) / total, 1);
      // ease-out-expo: fast start, soft landing on the final number
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCount(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return count;
}

export interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
}

export function AnimatedStat({ value, suffix, label }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 1600, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={ref} sx={{ textAlign: "center" }}>
      <Typography
        variant="h2"
        // Screen readers get the final number, not every frame of the count
        aria-label={`${value}${suffix ?? ""} ${label}`}
        sx={{
          fontSize: { xs: "2.5rem", md: "3.5rem" },
          color: "primary.main",
          fontWeight: 700,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span aria-hidden="true">
          {count}
          {suffix}
        </span>
      </Typography>
      <Typography
        variant="body1"
        aria-hidden="true"
        sx={{
          color: "text.secondary",
          mt: 1,
          fontSize: { xs: "0.9rem", md: "1rem" },
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
