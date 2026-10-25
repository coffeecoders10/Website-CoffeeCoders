# CoffeeCoders Website

A portfolio and showcase website for **CoffeeCoders** — a duo of software developers. The site displays team bios, live projects, portfolio projects, and statistics, with a password-protected admin dashboard for managing all site content.

**Built with:** Next.js 16 · React 19 · TypeScript · Material UI

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Dashboard

The admin dashboard lets you edit site content — team members, projects, statistics, social links, and the "About Us" section.

To access it, navigate to `/admin` and sign in with a Backbone user account. Only usernames listed in `ADMIN_USERNAMES` are allowed in; the server enforces this on every write.

## Environment Variables

Copy `.env.example` to `.env.local` and fill it in (all variables are server-side only):

```
BACKBONE_URL=
BACKBONE_DB_QUERY_API_KEY=
BACKBONE_SITE_TABLE=coffeecoders_website
BACKBONE_SITE_DETAILS_ID=1
ADMIN_USERNAMES=wsarvesh,swatkat
ADMIN_SESSION_SECRET=   # 32+ random chars
```

## Other Scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```
