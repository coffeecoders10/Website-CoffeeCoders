'use client';

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

/** Thin single-stroke glyphs for the phone navbar: small, outline only, no fills. */
function LineIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
      // MUI's own `fill: currentColor` class would win over an attribute, so these go through sx
      sx={{
        fontSize: '1.1rem',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.4,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        ...props.sx,
      }}
    />
  );
}

/** Live: a dot with a ring, like a broadcast signal */
export function LiveIcon() {
  return (
    <LineIcon>
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="7.5" />
    </LineIcon>
  );
}

/** Story: an open book */
export function StoryIcon() {
  return (
    <LineIcon>
      <path d="M3.5 6c3-1.2 6-.8 8.5 1 2.5-1.8 5.5-2.2 8.5-1v12c-3-1.2-6-.8-8.5 1-2.5-1.8-5.5-2.2-8.5-1V6Z" />
      <path d="M12 7v12" />
    </LineIcon>
  );
}

/** Projects: code brackets */
export function ProjectsIcon() {
  return (
    <LineIcon>
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
    </LineIcon>
  );
}

/** Team: two people */
export function TeamIcon() {
  return (
    <LineIcon>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c0-3 2.4-5 5.5-5s5.5 2 5.5 5" />
      <path d="M15.5 5.8a2.7 2.7 0 0 1 0 5.4M17.5 14.3c1.9.5 3 2.2 3 4.7" />
    </LineIcon>
  );
}
