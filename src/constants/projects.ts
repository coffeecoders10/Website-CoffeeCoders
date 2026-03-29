export interface Project {
  tag: string;
  title: string;
  body: string;
  cta: string;
  href?: string;
}

export const PROJECTS: Project[] = [
  {
    tag: "Web App",
    title: "CoffeeCoders Website",
    body: "The official CoffeeCoders club website — built with Next.js and MUI, showcasing our projects, team, and community.",
    cta: "View project",
    href: "https://github.com/CoffeeCoders",
  },
  {
    tag: "AI / ML",
    title: "Game Authoring Agentic Tool",
    body: "An agentic AI tool that helps authors design, prototype, and iterate on game mechanics using large language models.",
    cta: "View project",
    href: "https://github.com/CoffeeCoders",
  },
  {
    tag: "Full Stack",
    title: "Dev Dashboard",
    body: "A real-time developer productivity dashboard that aggregates GitHub activity, CI status, and team velocity metrics.",
    cta: "View project",
  },
  {
    tag: "Mobile",
    title: "Campus Connect",
    body: "A mobile-first app helping students discover clubs, events, and study groups on campus with smart recommendations.",
    cta: "View project",
  },
  {
    tag: "Tooling",
    title: "CLI Scaffolder",
    body: "A command-line scaffolding tool that bootstraps opinionated project templates with linting, testing, and CI baked in.",
    cta: "View project",
  },
  {
    tag: "Open Source",
    title: "Component Library",
    body: "A shared MUI-based component library used across CoffeeCoders projects — batteries included, fully typed.",
    cta: "View project",
  },
];
