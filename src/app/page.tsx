"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";

import {
  FadeIn,
  Navbar,
  ContentCard,
  GalleryGrid,
  ProfileCard,
  Footer,
  AnimatedStat,
} from "@components";
import { Container } from "@mui/material";
import defaultData from "@/constants/website-details.json";

interface SiteData {
  socials: { github: string; email: string };
  about: string;
  stats: { label: string; value: number; suffix?: string }[];
  team: { name: string; role: string; bio: string; avatarSrc?: string; github?: string; website?: string }[];
  live_projects: { title: string; body: string; cta: string; href?: string }[];
  projects: { title: string; body: string; cta: string; href?: string }[];
}

const PROJECTS_PER_PAGE = 4;

export default function Home() {
  const [data, setData] = useState<SiteData | null>(null);
  const [projectsPage, setProjectsPage] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/details?id=1");
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
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  const { about, stats, team, live_projects, projects } = data;
  const projectsPageCount = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const pagedProjects = projects.slice(
    (projectsPage - 1) * PROJECTS_PER_PAGE,
    projectsPage * PROJECTS_PER_PAGE
  );

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Navbar />

      {/* Hero */}
      <FadeIn onLoadOnly delay={100}>
        <Box
          component="section"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            marginTop: 20,
            px: 3,
            gap: 1,
            py: 5,
          }}
        >
          <Image
            src="/coffeecoders_logo.png"
            alt="CoffeeCoders logo"
            width={120}
            height={120}
            loading="eager"
            style={{ marginBottom: "8px" }}
          />

          <Typography
            sx={{
              fontFamily: "var(--font-tertiary)",
              fontSize: { xs: "2rem", md: "2.75rem" },
              color: "text.dark",
              mt: 3,
              lineHeight: 0.5,
            }}
          >
            Welcome to
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "5rem" },
              color: "text.primary",
              lineHeight: 1,
              mb: 0,
            }}
          >
            CoffeeCoders
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              color: "text.main",
              opacity: 0.7,
            }}
          >
            The place where Caffine creates Code.
          </Typography>
        </Box>
      </FadeIn>

      {/* Live Projects */}
      <FadeIn delay={100}>
        <Container maxWidth="lg" sx={{ mb: 8, mt: 10 }}>
          <Box component="section" sx={{ px: { xs: 3, md: 8 }, mx: "auto" }}>
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-tertiary)",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: "text.dark",
                  lineHeight: 0.75,
                }}
              >
                Discover our
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1rem", md: "2rem" },
                  color: "text.primary",
                  fontWeight: 500,
                  mt: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Live Projects
              </Typography>
            </Box>
            <GalleryGrid
              columns={{ xs: 1, md: 3 }}
              gap={3}
              items={live_projects.map((project, i) => (
                <FadeIn key={project.title} delay={i * 80}>
                  <ContentCard
                    title={project.title}
                    body={project.body}
                    cta={project.cta}
                    onCtaClick={
                      project.href
                        ? () => window.open(project.href, "_blank")
                        : undefined
                    }
                    sx={{ height: "100%" }}
                  />
                </FadeIn>
              ))}
            />
          </Box>
        </Container>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={100}>
        <Box
          component="section"
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
      <FadeIn delay={300}>
        <Container maxWidth="lg" sx={{ py: 10, px: { xs: 3, md: 1 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 6, md: 6 },
            }}
          >
            <Box
              sx={{
                flex: "0 0 35%",
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
              }}
            >
              <Image
                src="/coffeecoders_logo.png"
                alt="CoffeeCoders logo"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>

            <Box sx={{ flex: "0 0 60%" }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-tertiary)",
                  fontSize: { xs: "1.5rem", md: "2.5rem" },
                  color: "text.dark",
                  lineHeight: 1,
                }}
              >
                Explore
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: "text.primary",
                  mt: 0.5,
                  mb: 3,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Our Story
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.9,
                }}
              >
                {about}
              </Typography>
            </Box>
          </Box>
        </Container>
      </FadeIn>

      {/* Projects */}
      <FadeIn delay={100}>
        <Container maxWidth="lg" sx={{ py: 10, px: { xs: 3, md: 1 } }}>
          <Box component="section">
            <Box sx={{ mb: 6, px: { xs: 0, md: 7 }, textAlign: "center" }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-tertiary)",
                  fontSize: { xs: "1.5rem", md: "2.5rem" },
                  color: "text.dark",
                  lineHeight: 0.75,
                }}
              >
                Find out more
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: "text.primary",
                  mt: 0.5,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Projects
              </Typography>
            </Box>
            <Box sx={{ px: { xs: 0, md: 8 } }}>
              <GalleryGrid
                columns={{ xs: 1, md: 2 }}
                gap={3}
                items={pagedProjects.map((project, i) => (
                  <FadeIn key={project.title} delay={i * 80}>
                    <ContentCard
                      title={project.title}
                      body={project.body}
                      cta={project.cta}
                      onCtaClick={
                        project.href
                          ? () => window.open(project.href, "_blank")
                          : undefined
                      }
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
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </FadeIn>

      {/* Team */}
      <FadeIn delay={100}>
        <Box
          component="section"
          sx={{
            mb: { xs: 8, md: 10 },
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-tertiary)",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: "text.dark",
                  lineHeight: 1,
                }}
              >
                Meet the
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1rem", md: "2rem" },
                  color: "text.primary",
                  mt: 0.5,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Coffee Coders
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: `repeat(${team.length}, 1fr)`,
                },
                gap: 4,
                px: { xs: 3, md: 8 },
                maxWidth: 700,
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
      </FadeIn>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
