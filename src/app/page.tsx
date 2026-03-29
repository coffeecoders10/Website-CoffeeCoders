"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import {
  FadeIn,
  Navbar,
  ContentCard,
  GalleryGrid,
  ProfileCard,
  Footer,
} from "@components";
import { PROJECTS } from "@/constants/projects";
import { ARCHIVED_PROJECTS } from "@/constants/archived-projects";
import { STATS } from "@/constants/stats";
import { TEAM } from "@/constants/team";
import { Container } from "@mui/material";

function useCountUp(target: number, duration = 1500, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);

  return count;
}

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 1500, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
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
        sx={{
          fontSize: { xs: "2.5rem", md: "3.5rem" },
          color: "primary.main",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {count}
        {suffix}
      </Typography>
      <Typography
        variant="body1"
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

export default function Home() {
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

      {/* Projects */}
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
              items={PROJECTS.map((project, i) => (
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
                  md: `repeat(${STATS.length}, 1fr)`,
                },
                gap: { xs: 6, md: 4 },
                px: { xs: 3, md: 8 },
              }}
            >
              {STATS.map((stat) => (
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
            {/* Logo */}
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

            {/* Text */}
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
                In 2018, both of us met for the first time in college. As years
                passed, project after project, we realized that our coding
                ethics and habits were inherently coordinated. As the Pandemic
                of 2020 hit, we had already worked on small scale projects
                throughout the semesters. The Pandemic gave us enough time to
                fool around with projects that interested us. Soon we developed
                project after project. We decided we needed a platform to store
                and recognize our work. And that is how CoffeeCoders came into
                existence.
              </Typography>
            </Box>
          </Box>
        </Container>
      </FadeIn>

      {/* Archived Projects */}
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
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  color: "text.main",
                  opacity: 0.7,
                }}
              >
                These Projects are built, but not hosted yet.
              </Typography>
            </Box>
            <Box sx={{ px: { xs: 0, md: 8 } }}>
              <GalleryGrid
                columns={{ xs: 1, md: 2 }}
                gap={3}
                items={ARCHIVED_PROJECTS.map((project, i) => (
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
                  md: `repeat(${TEAM.length}, 1fr)`,
                },
                gap: 4,
                px: { xs: 3, md: 8 },
                maxWidth: 700,
                mx: "auto",
              }}
            >
              {TEAM.map((member, i) => (
                <FadeIn key={member.name} delay={i * 100}>
                  <ProfileCard
                    name={member.name}
                    role={member.role}
                    bio={member.bio}
                    avatarSrc={member.avatarSrc}
                    actions={
                      member.github
                        ? [
                            {
                              label: "GitHub",
                              onClick: () =>
                                window.open(member.github, "_blank"),
                              variant: "outlined",
                            },
                          ]
                        : undefined
                    }
                    sx={{ height: "100%" }}
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
