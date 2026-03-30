export interface ArchivedProject {
  tag: string;
  title: string;
  body: string;
  cta: string;
  href?: string;
}

export const ARCHIVED_PROJECTS: ArchivedProject[] = [
  {
    tag: "Web App",
    title: "Portfolio v1",
    body: "The first iteration of the CoffeeCoders personal portfolio — a static site built with HTML, CSS, and vanilla JS.",
    cta: "View on GitHub",
    href: "https://github.com/CoffeeCoders",
  },
  {
    tag: "Backend",
    title: "REST API Boilerplate",
    body: "An opinionated Express + TypeScript REST API starter with JWT auth, rate limiting, and Swagger docs baked in.",
    cta: "View on GitHub",
    href: "https://github.com/CoffeeCoders",
  },
  {
    tag: "Mobile",
    title: "Weather Buddy",
    body: "A React Native weather app with location-based forecasts, animated weather icons, and a clean minimal UI.",
    cta: "View on GitHub",
    href: "https://github.com/CoffeeCoders",
  },
  {
    tag: "Chrome Extension",
    title: "Tab Organizer",
    body: "A browser extension that groups, labels, and auto-suspends idle tabs to keep your workspace tidy.",
    cta: "View on GitHub",
    href: "https://github.com/CoffeeCoders",
  },
  {
    tag: "CLI Tool",
    title: "Dev Setup CLI",
    body: "A command-line tool that bootstraps a new dev machine with dotfiles, package installs, and shell config in one command.",
    cta: "View on GitHub",
    href: "https://github.com/CoffeeCoders",
  },
  {
    tag: "Discord Bot",
    title: "StudyBot",
    body: "A Discord bot that runs Pomodoro timers, tracks study streaks, and posts daily challenges to keep your server accountable.",
    cta: "View on GitHub",
    href: "https://github.com/CoffeeCoders",
  },
];
