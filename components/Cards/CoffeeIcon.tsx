'use client';

import { ReactNode } from 'react';
import Box from '@mui/material/Box';

/** Line-drawn coffee vessels. All share a 44x44 box with the base sitting at y = 41.5. */
export const COFFEE_ICON_TYPES = [
  'mug',
  'takeaway',
  'espresso',
  'frenchPress',
  'flask',
  'moka',
  'pourOver',
  'latte',
] as const;

export type CoffeeIconType = (typeof COFFEE_ICON_TYPES)[number];

/**
 * Three hand-drawn wisps (a short drift, a tall bend, a leaning tail), drawn for a mug whose
 * rim is at y = 18. `base` moves the wisps to another rim height and `scale` shrinks them for
 * vessels with less headroom.
 */
function Steam({ base = 18, scale = 1 }: { base?: number; scale?: number }) {
  const tx = 22 * (1 - scale);
  const ty = base - 18 * scale;
  return (
    <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
      <path className="steam-wisp" strokeWidth={1.4} d="M14.5 18c-2-2.5 2.5-4 .8-7" />
      <path className="steam-wisp" d="M21 18c-2.5-3 2.5-5.5.5-9-1-1.8.2-3.6 1-5" />
      <path className="steam-wisp" strokeWidth={1.4} d="M27.5 18c2-2.5-1.5-4.5.5-7.5 1-1.5 2.5-1.8 3.2-3.6" />
    </g>
  );
}

const ICONS: Record<CoffeeIconType, ReactNode> = {
  // Straight-sided mug with a D handle on a saucer line
  mug: (
    <>
      <Steam base={18} />
      <path d="M9 22h23v13a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V22Z" />
      <path d="M32 25h2.5a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H32" />
      <path d="M7 41.5h27" />
    </>
  ),

  // Takeaway cup: tapered body, lid with a sip spout, cardboard sleeve
  takeaway: (
    <>
      <Steam base={15} scale={0.85} />
      <path d="M15.5 21v-1.5h13V21" />
      <path d="M12 21h20v2.5H12Z" />
      <path d="M13 23.5 15 39.5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2l2-16" />
      <path d="M13.8 29.5h16.4M14.3 35h15.4" />
    </>
  ),

  // Small espresso cup with a wide saucer
  espresso: (
    <>
      <Steam base={22} scale={0.75} />
      <path d="M12 26h17v4a7.5 7.5 0 0 1-7.5 7.5h-2A7.5 7.5 0 0 1 12 30v-4Z" />
      <path d="M29 28h1.5a2.7 2.7 0 0 1 0 5.4H28.5" />
      <path d="M7 41.5h30" />
      <path d="M13 38.5h15" strokeWidth={1.2} opacity={0.6} />
    </>
  ),

  // French press: glass beaker, metal frame, plunger rod and knob
  frenchPress: (
    <>
      <Steam base={10} scale={0.55} />
      <path d="M22 13.5v6.5M19 13.5h6" />
      <path d="M12 20.5h20" />
      <path d="M13 20.5v18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-18" />
      <path d="M13 28.5h18" strokeDasharray="1 3.2" />
      <path d="M31 24h2.5a2.5 2.5 0 0 1 2.5 2.5v6a2.5 2.5 0 0 1-2.5 2.5H31" />
    </>
  ),

  // Insulated flask: capped bottle with a grip band
  flask: (
    <>
      <Steam base={9} scale={0.55} />
      <path d="M19 15.5v-3.5h6v3.5" />
      <path d="M16 15.5h12a1.5 1.5 0 0 1 1.5 1.5v3.5h-15V17a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M14.5 20.5h15v18a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-18Z" />
      <path d="M14.5 28h15M14.5 32h15" />
    </>
  ),

  // Stovetop moka pot: base, waist, upper chamber, lid and handle
  moka: (
    <>
      <Steam base={11} scale={0.55} />
      <path d="M19.5 15.5v-2.5h5v2.5" />
      <path d="M15.5 19l1-3.5h11l1 3.5Z" />
      <path d="M16.5 19 15 28.5h14L27.5 19" />
      <path d="M15 28.5l-1.5 3h17l-1.5-3" />
      <path d="M13.5 31.5 11.5 41.5h21l-2-10" />
      <path d="M28.7 20.5h4.3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3.3" />
      <path d="M15.5 19l-3-1.5" />
    </>
  ),

  // Pour-over: cone dripper on a stand above a carafe
  pourOver: (
    <>
      <Steam base={11} scale={0.55} />
      <path d="M11 14h22l-5.5 8h-11Z" />
      <path d="M17.5 22v2.5h9V22" />
      <path d="M20 24.5V28l-6 9.5a3 3 0 0 0 2.5 4h11a3 3 0 0 0 2.5-4L24 28v-3.5" />
      <path d="M22 25.5v.5" strokeWidth={2.4} />
      <path d="M15.5 36h13" />
    </>
  ),

  // Tall latte glass with two visible layers
  latte: (
    <>
      <Steam base={13} scale={0.7} />
      <path d="M12.5 16.5h19l-2 22a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3l-2-22Z" />
      <path d="M13.6 26.5h16.8M14.4 33.5h15.2" />
    </>
  ),
};

export interface CoffeeIconProps {
  /** A vessel name, or a number that cycles through them (handy for lists) */
  type?: CoffeeIconType | number;
  size?: number;
}

/** Coffee vessel icon. Steam wisps carry `.steam-wisp` so a parent can reveal them on hover. */
export default function CoffeeIcon({ type = 'mug', size = 44 }: CoffeeIconProps) {
  const name: CoffeeIconType =
    typeof type === 'number'
      ? COFFEE_ICON_TYPES[((type % COFFEE_ICON_TYPES.length) + COFFEE_ICON_TYPES.length) % COFFEE_ICON_TYPES.length]
      : type;

  return (
    <Box
      component="svg"
      className="steam"
      viewBox="0 0 44 44"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      sx={{ display: 'block', overflow: 'visible' }}
    >
      {ICONS[name]}
    </Box>
  );
}
