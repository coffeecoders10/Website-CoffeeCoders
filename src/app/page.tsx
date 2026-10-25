"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import Image from "next/image";

import {
  FadeIn,
  Navbar,
  ContentCard,
  GalleryGrid,
  ProfileCard,
  Footer,
  AnimatedStat,
  SectionHeader,
  COFFEE_ICON_TYPES,
  LiveIcon,
  StoryIcon,
  ProjectsIcon,
  TeamIcon,
} from "@components";
import type { CoffeeIconType } from "@components";
import { Container } from "@mui/material";
import defaultData from "@/constants/website-details.json";
import { computeStats } from "@/lib/stats";

interface ProjectItem {
  title: string;
  body: string;
  href?: string;
  /** A CoffeeIcon name chosen in the admin; blank falls back to cycling through the set */
  icon?: string;
}

function pickIcon(icon: string | undefined, fallback: number): CoffeeIconType | number {
  return COFFEE_ICON_TYPES.includes(icon as CoffeeIconType) ? (icon as CoffeeIconType) : fallback;
}

interface SiteData {
  socials: { github: string; email: string };
  about: string;
  team: { name: string; role: string; bio: string; avatarSrc?: string; github?: string; website?: string }[];
  live_projects: ProjectItem[];
  projects: ProjectItem[];
}

const PROJECTS_PER_PAGE = 4;

const NAV_LINKS = [
  { label: "Live", href: "#live-projects", icon: <LiveIcon /> },
  { label: "Story", href: "#story", icon: <StoryIcon /> },
  { label: "Projects", href: "#projects", icon: <ProjectsIcon /> },
  { label: "Team", href: "#team", icon: <TeamIcon /> },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const heroButtonSx = {
  minHeight: 40,
  py: 0.5,
  px: 3,
  borderRadius: 999,
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.95rem",
  transition: `transform 0.3s ${EASE}, box-shadow 0.3s ${EASE}, background-color 0.3s`,
  "@media (hover: hover)": {
    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(196,155,99,0.22)" },
  },
  "&:active": { transform: "scale(0.97)" },
} as const;

export default function Home() {
  const [data, setData] = useState<SiteData | null>(null);
  const [projectsPage, setProjectsPage] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/details");
        if (res.ok) {
          const json = await res.json();
          setData(json.pjson ?? json);
        } else {
          setData(defaultData as SiteData);
        }
      } catch {
        setData(defaultData as SiteData);
      }
    }
    load();
  }, []);

  if (!data) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ bgcolor: "background.default" }}
      >
        <Box
          sx={{
            animation: "loadingPulse 1.6s ease-in-out infinite",
            "@keyframes loadingPulse": {
              "0%, 100%": { opacity: 0.35, transform: "scale(0.96)" },
              "50%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        >
          <Image src="/coffeecoders_logo.png" alt="Loading CoffeeCoders" width={96} height={96} priority />
        </Box>
      </Box>
    );
  }

  const { about, team, live_projects, projects } = data;
  const stats = computeStats(live_projects.length + projects.length);
  const projectsPageCount = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const pagedProjects = projects.slice(
    (projectsPage - 1) * PROJECTS_PER_PAGE,
    projectsPage * PROJECTS_PER_PAGE
  );

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Navbar links={NAV_LINKS} />

      {/* Hero: one staggered load sequence plus a slow glow, the only auto-playing motion */}
      <Box
        component="section"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: { xs: "92svh", md: "100svh" },
          px: 3,
          pt: { xs: 12, md: 14 },
          pb: { xs: 8, md: 10 },
          overflow: "hidden",
        }}
      >
        {/* Warm crema glow that breathes behind the cup */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            top: { xs: "36%", md: "40%" },
            left: "50%",
            width: { xs: 340, md: 620 },
            height: { xs: 340, md: 620 },
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(161,103,69,0.26) 0%, rgba(161,103,69,0.08) 45%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            animation: "heroBreathe 7s ease-in-out infinite",
            "@keyframes heroBreathe": {
              "0%, 100%": { opacity: 0.65, transform: "translate(-50%, -50%) scale(0.94)" },
              "50%": { opacity: 1, transform: "translate(-50%, -50%) scale(1.06)" },
            },
          }}
        />

        <Box sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <FadeIn onLoadOnly delay={100} duration={900}>
            <Image
              src="/coffeecoders_logo.png"
              alt="CoffeeCoders logo"
              width={140}
              height={140}
              priority
              style={{ width: "clamp(104px, 22vw, 140px)", height: "auto" }}
            />
          </FadeIn>

          <FadeIn onLoadOnly delay={250}>
            <Typography
              component="p"
              sx={{
                fontFamily: "var(--font-tertiary)",
                fontSize: { xs: "2rem", md: "2.75rem" },
                color: "text.dark",
                mt: 3,
                lineHeight: 1,
              }}
            >
              Welcome to
            </Typography>
          </FadeIn>

          <FadeIn onLoadOnly delay={400}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "clamp(2.5rem, 12vw, 3.5rem)", md: "5.5rem" },
                color: "text.primary",
                lineHeight: 1.05,
                mt: 0.5,
              }}
            >
              CoffeeCoders
            </Typography>
          </FadeIn>

          <FadeIn onLoadOnly delay={550}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                color: "text.secondary",
                mt: 1.5,
                maxWidth: 420,
                mx: "auto",
              }}
            >
              The place where Caffine creates Code.
            </Typography>
          </FadeIn>

          <FadeIn onLoadOnly delay={700} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mt: 5,
              }}
            >
              <Button component="a" href="#live-projects" variant="contained" color="primary" sx={heroButtonSx}>
                See what we built
              </Button>
              <Button component="a" href="#story" variant="outlined" color="primary" sx={heroButtonSx}>
                Read our story
              </Button>
            </Box>
          </FadeIn>
        </Box>
      </Box>

      {/* Live Projects */}
      <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 10 } }}>
        <Box component="section" id="live-projects" sx={{ px: { xs: 3, md: 8 }, mx: "auto" }}>
          <FadeIn>
            <SectionHeader eyebrow="Discover our" title="Live Projects" />
          </FadeIn>
          <GalleryGrid
            columns={{ xs: 1, md: 3 }}
            gap={3}
            items={live_projects.map((project, i) => (
              <FadeIn key={project.title} delay={i * 80}>
                <ContentCard
                  title={project.title}
                  body={project.body}
                  href={project.href}
                  icon={pickIcon(project.icon, i)}
                  sx={{ height: "100%" }}
                />
              </FadeIn>
            ))}
          />
        </Box>
      </Container>

      {/* Stats */}
      <FadeIn>
        <Box
          component="section"
          aria-label="CoffeeCoders by the numbers"
          sx={{
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
            py: { xs: 8, md: 10 },
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  md: `repeat(${stats.length}, 1fr)`,
                },
                gap: { xs: 6, md: 4 },
                px: { xs: 3, md: 8 },
              }}
            >
              {stats.map((stat) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              ))}
            </Box>
          </Container>
        </Box>
      </FadeIn>

      {/* About Us */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, md: 1 } }}>
        <Box
          component="section"
          id="story"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: 8 },
          }}
        >
          <FadeIn sx={{ flex: { md: "0 0 35%" }, width: "100%", maxWidth: { xs: 240, md: "none" } }}>
            <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
              <Image
                src="/coffeecoders_logo.png"
                alt="CoffeeCoders logo"
                fill
                sizes="(max-width: 900px) 240px, 380px"
                style={{ objectFit: "contain" }}
              />
            </Box>
          </FadeIn>

          <FadeIn delay={150} sx={{ flex: 1 }}>
            <SectionHeader eyebrow="Explore" title="Our Story" align="left" sx={{ mb: 3 }} />
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.9,
                maxWidth: "62ch",
              }}
            >
              {about}
            </Typography>
          </FadeIn>
        </Box>
      </Container>

      {/* Projects */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 }, px: { xs: 3, md: 1 } }}>
        <Box component="section" id="projects">
          <FadeIn>
            <SectionHeader eyebrow="Find out more" title="Projects" />
          </FadeIn>
          <Box sx={{ px: { xs: 0, md: 8 } }}>
            {/* Keyed by page so cards replay their entrance when paging */}
            <GalleryGrid
              key={projectsPage}
              columns={{ xs: 1, md: 2 }}
              gap={3}
              items={pagedProjects.map((project, i) => (
                <FadeIn key={project.title} delay={i * 80} duration={600}>
                  <ContentCard
                    title={project.title}
                    body={project.body}
                      href={project.href}
                    icon={pickIcon(project.icon, 3 + (projectsPage - 1) * PROJECTS_PER_PAGE + i)}
                    sx={{ height: "100%" }}
                  />
                </FadeIn>
              ))}
            />
            {projectsPageCount > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Pagination
                  count={projectsPageCount}
                  page={projectsPage}
                  onChange={(_, page) => setProjectsPage(page)}
                  color="primary"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      transition: `background-color 0.25s, transform 0.25s ${EASE}`,
                      "&:active": { transform: "scale(0.94)" },
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Team */}
      <Box component="section" id="team" sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <FadeIn>
            <SectionHeader eyebrow="Meet the" title="Coffee Coders" />
          </FadeIn>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: `repeat(${team.length}, 1fr)`,
              },
              gap: 4,
              px: { xs: 3, md: 8 },
              maxWidth: { xs: 420, md: 700 },
              mx: "auto",
            }}
          >
            {team.map((member, i) => (
              <FadeIn key={member.name} delay={i * 100}>
                <ProfileCard
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                  avatarSrc={member.avatarSrc}
                  github={member.github}
                  website={member.website}
                />
              </FadeIn>
            ))}
          </Box>
        </Container>
      </Box>

      <Footer github={data.socials.github} email={data.socials.email} />
    </Box>
  );
}
