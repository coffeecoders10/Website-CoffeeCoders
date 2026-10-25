# CoffeeCoders Design System

Reference for building new features so they look and behave like the rest of the site. Derived from the existing code; when this file and the code disagree, the code in `src/lib/theme.ts` and `components/` wins. Update this file when you change them.

## Stack

- Next.js 16 (App Router), React 19, TypeScript. Read `node_modules/next/dist/docs/` before using Next APIs (see AGENTS.md).
- MUI v7 (`@mui/material`, `@mui/icons-material`) with Emotion. Styling is done with the `sx` prop and theme tokens. There is no Tailwind.
- Always dark mode. The theme is `palette.mode: "dark"` in [src/lib/theme.ts](src/lib/theme.ts), applied by [src/app/providers.tsx](src/app/providers.tsx) (`ThemeProvider` + `CssBaseline`).
- Import path aliases: `@/*` → `src/*`, `@components` → `components/index.ts`. Import shared components from `@components`.

## Brand feel

A dark, warm "coffee shop at night" look: near-black background, caramel/gold accents, brown borders, cream text. Headings are uppercase and geometric; a script font adds a small hand-written eyebrow above them. Motion is slow and soft (fade and rise), never bouncy.

## Color tokens

Use theme tokens (`"primary.main"`, `"text.secondary"`, `"divider"`), not raw hex, in new code.

| Token | Value | Use |
|---|---|---|
| `background.default` | `#0D0D0D` | Page background (set on the root `Box` of each page) |
| `background.surface` | `#2a2a2a` | Card fills (at low alpha), nav border. Custom key, typed in theme.ts |
| `primary.main` | `#c49b63` | Gold. Stat numbers, links on hover, active pagination, buttons |
| `primary.light` | `#d4b484` | Highlights, icon accents |
| `primary.dark` | `#9a7440` | Pressed/dark gold |
| `secondary.main` | `#693519` | Brown. Scrollbar hover |
| `secondary.dark` | `#492A17` | Profile card placeholder fill, scrollbar thumb |
| `secondary.light` | `#A16745` | Hover glow (`rgba(161,103,69,…)`) |
| `text.primary` | `#F5EDE6` | Headings and main text (cream) |
| `text.secondary` | `#C4896A` | Body copy, labels, footer icons (terracotta) |
| `text.dark` | `#9a7440` | Script eyebrow text. Custom key, typed in theme.ts |
| `divider` | `#492A17` | Section rules, card borders |

Rules:
- Translucent surfaces use `alpha(theme.palette.background.surface, 0.2)`, as in `ContentCard`.
- The sticky navbar glass is `rgba(13,13,13,0.6)` with `blur(12px)`.
- Do not introduce new accent hues. If something needs emphasis, use `primary.main`.
- Not valid: `text.main`. The hero subtitle uses it by mistake and it silently falls back. Use `text.primary` or `text.secondary`.

## Typography

Three Google fonts are loaded in [src/app/layout.tsx](src/app/layout.tsx) and exposed as CSS variables.

| Role | Font | Variable | Used for |
|---|---|---|---|
| Primary | Poppins (300–700) | `--font-primary` | Body, UI, buttons |
| Secondary | Josefin Sans (400, 700) | `--font-secondary` | `h1`–`h6` (set in the theme) |
| Tertiary | Great Vibes (400) | `--font-tertiary` | Script eyebrows only |

### Section header pattern

Every section starts with a script eyebrow over an uppercase `h2`, centered:

```tsx
<Box sx={{ textAlign: "center", mb: 6 }}>
  <Typography sx={{ fontFamily: "var(--font-tertiary)", fontSize: { xs: "1.5rem", md: "2.5rem" }, color: "text.dark", lineHeight: 0.75 }}>
    Find out more
  </Typography>
  <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "3rem" }, color: "text.primary", mt: 0.5, textTransform: "uppercase", fontWeight: 700 }}>
    Projects
  </Typography>
</Box>
```

Eyebrow wording is an invitation: "Discover our", "Explore", "Find out more", "Meet the". Script font is for these eyebrows and the hero "Welcome to" only. Never for body text or buttons.

Easing for new motion: `cubic-bezier(0.22, 1, 0.36, 1)`, 0.25–0.7s.

Sizes in use:
- Hero title: `3rem` / `5rem` (xs / md). Hero script: `2rem` / `2.75rem`.
- Section `h2`: `2rem` / `3rem` for primary sections. The existing "Live Projects" and "Meet the Coffee Coders" use a smaller `1rem` / `2rem`, so pick one scale per page and keep it.
- Body copy: `1rem` / `1.1rem`, `lineHeight: 1.9` for long prose; card text uses `body2`.
- Stats: `2.5rem` / `3.5rem`, weight 700.

## Layout and spacing

- Page shell: root `<Box sx={{ bgcolor: "background.default" }}>` containing `<Navbar />`, sections, then `<Footer />`.
- Content width: `<Container maxWidth="lg">`. Sections inside add horizontal padding `px: { xs: 3, md: 8 }` (or `md: 1` for full-width rows like About).
- Vertical rhythm: `py: 10` for major sections (`{ xs: 8, md: 10 }` for banded ones). Header-to-content gap is `mb: 3`–`6`. Grid gap is `3` (cards) or `4` (profiles).
- Banded sections (e.g. Stats) use `borderTop` and `borderBottom` with `borderColor: "divider"`.
- The navbar is fixed (about 96px tall). Pages that sit under it need top offset (`marginTop: 20` on the hero, `mt: 15` on admin).
- Responsive grids: use [GalleryGrid](components/GalleryGrid/GalleryGrid.tsx) with `columns={{ xs: 1, md: 2 | 3 }}`. For custom grids use `gridTemplateColumns: { xs: "1fr", md: "repeat(n, 1fr)" }`.
- Mobile first: always give `xs` values, and design for `xs` and `md`. The code rarely uses `sm`.

## Shape, borders, elevation

- Cards: `borderRadius: 5` (ContentCard), `3` (ProfileCard image). Inputs/panels: `2`.
- Borders are `1px` (section rules, nav) or `2px` (cards), always `divider`.
- Shadows are rare and warm: card hover is `0 4px 24px rgba(161,103,69,0.15)`. No heavy drop shadows.
- Scrollbar is themed in [globals.css](src/app/globals.css) (`#492A17` thumb on `#0D0D0D`).

## Components

All live in `components/<Name>/` with an `index.ts`, and are re-exported from [components/index.ts](components/index.ts). New shared components follow the same shape: `'use client'`, MUI primitives, `sx?: SxProps<Theme>` merged last (`...sx`), exported props interface.

| Component | Use | Notes |
|---|---|---|
| `Navbar` | Fixed top bar with logo + wordmark | Transparent at top; glass blur after 10px scroll, reading-progress line. Optional `links` prop (`{label, href, icon}`) adds in-page anchors: text links with a hover underline on desktop, icon-only links in the bar on phones (no hamburger), active-section highlight. Include on every page |
| `Footer` | Logo, GitHub and email icons, © year | Takes `github` and `email` props from site data |
| `FadeIn` | Scroll-triggered fade and 20px rise | Props: `delay`, `duration` (700ms), `offsetY`, `onLoadOnly` (use for above-the-fold). Respects reduced motion. Wrap section headers and cards, not both a section and its cards |
| `SectionHeader` | Script eyebrow over uppercase `h2` | Props: `eyebrow`, `title`, `align`. Use instead of hand-writing the header pattern |
| `ContentCard` | Title, body, a line-drawn coffee vessel icon above the title (`icon` prop: a name or a number that cycles; the admin stores a name per project in `icon`, blank = cycle), then a dashed rule with a slanted arrow on the right | Pass `href` to make the whole card a real link (new tab); There is no button label. `onCtaClick` still works. A faint coffee-ring stain sits in the corner. Hover/focus (hover-capable devices): a dim brown glow follows the cursor, the card lifts, steam fades in above the mug and the arrow lifts |
| `ProfileCard` | 3:4 portrait with gradient overlay, name/role, bio revealed on hover/focus (always visible on touch), GitHub/website icon links | Falls back to `secondary.dark` when no `avatarSrc` |
| `GalleryGrid` | Responsive grid with optional paging (numbers or dots) | Passing `columns` as an object, paging uses the `md` count |
| `Carousel` | `interaction` (arrows/dots) or `continuous` (marquee, pauses on hover) | |
| `CoffeeIcon` | Line-drawn coffee vessels: mug, takeaway, espresso, frenchPress, flask, moka, pourOver, latte, cappuccino, travelMug, glassMug, aeropress, chemex, cezve | `type` (name or cycling number), `size`. Steam wisps have class `steam-wisp` and start hidden; a parent reveals them on hover |
| `AnimatedStat` | Count-up number when scrolled into view | Gold number over secondary label |

Before adding a component, check whether one of these (or a prop on one) covers it.

### Interaction conventions

- Hover on cards: slow glow and subtle movement (0.2–0.45s ease). Hover on icon buttons: color shifts from `text.secondary` to `primary.main`.
- CTA links are `Button variant="text"`, `primary.light`, followed by ` →`. Primary actions (forms) use `variant="contained" color="primary"`.
- Icons: `@mui/icons-material` only. Outlined variant for decorative ones (`LocalCafeOutlined`).
- Staggering: when fading in a list, use `delay={i * 80}` (cards) or `i * 100` (profiles).
- External links open in a new tab (`rel="noopener noreferrer"` on anchors).

## Content and data

- All site copy lives in one JSON document: shape in [src/constants/website-details.json](src/constants/website-details.json), type `SiteData` (`socials`, `about`, `team`, `live_projects`, `projects`; each project has `title`, `body`, `href`, `icon`).
- The document lives in Backbone (table `BACKBONE_SITE_TABLE`, row `BACKBONE_SITE_DETAILS_ID`), accessed only server-side via [src/lib/backbone.ts](src/lib/backbone.ts). Pages load it from `GET /api/details` and fall back to the bundled JSON on failure or 404. The admin dashboard (`/admin`, Backbone user login, restricted to `ADMIN_USERNAMES`, with a signed session cookie from [src/lib/session.ts](src/lib/session.ts)) edits and saves it.
- A new content section should add a field to `SiteData`, to the JSON default, and to the admin editor, so it stays editable. Do not hard-code copy in JSX.
- Voice: friendly, short, coffee-flavored ("The place where Caffine creates Code").
- Static assets are in `public/`. Logo is `/coffeecoders_logo.png`; team photos are `/<name>-profile.jpg`.

Home page stats are not stored. [src/lib/stats.ts](src/lib/stats.ts) calculates them: projects = live + other projects, years = current year minus 2018, lines of code = projects x 7,200 (in thousands), cups of coffee = 1000+.

## Forms and admin UI

- Standard MUI `TextField` (`size="small"`, `variant="outlined"`), `Alert` for errors, `Accordion` to group repeated entries, `Divider` between groups, `Tooltip`'d `IconButton`s for add/delete/download.
- The admin shares the public `Navbar` and `Footer` and the dark theme. Do not give it a separate look.

## Accessibility

- Give every `IconButton` an `aria-label` and every image meaningful `alt`.
- Text contrast: `text.primary` on `#0D0D0D` is fine; `text.secondary` (`#C4896A`) is fine for body but avoid it below 14px. `text.dark` is decorative script only.
- Respect reduced motion in any new animation. `globals.css` has a global reduce rule and `FadeIn`/`AnimatedStat` handle it themselves.
- Make clickable non-link elements real `<a>`/`<button>` elements. Focus ring is global (`:focus-visible`, gold).
- Gate hover-only effects behind `@media (hover: hover)` and never hide essential content behind hover.
- Touch targets are at least 44px.

## Known inconsistencies (don't copy these)

- [page.module.css](src/app/page.module.css) is unused template CSS. Don't add CSS modules; use `sx`.
- [DemoSections.tsx](src/app/DemoSections.tsx) is an unused component showcase; useful as a usage reference only.
- Raw hex/rgba values appear in `Navbar`, `ContentCard` and `ProfileCard`. New code should use theme tokens.

## Checklist for a new feature

1. Reuse components from `@components`; wrap sections in `FadeIn`.
2. Use the section header pattern (script eyebrow over uppercase `h2`).
3. Theme tokens only, no new colors or fonts.
4. `Container maxWidth="lg"`, section padding as above, `xs` and `md` breakpoints.
5. Copy comes from `SiteData`, with admin editing support.
6. Include `Navbar` and `Footer` on any new route.
7. Check at 375px and 1280px wide.
