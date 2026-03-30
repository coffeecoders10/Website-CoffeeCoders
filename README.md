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

To access it, navigate to `/admin` and enter the admin password.

## Environment Variables

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_ADMIN_PWD=your_admin_password
NEXT_PUBLIC_API_URL=https://your-backend-url
NEXT_PUBLIC_API_TOKEN=your_api_token
```

## Other Scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```
