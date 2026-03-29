"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { FadeIn, Navbar, ContentCard, GalleryGrid } from "@components";
import { PROJECTS } from "@/constants/projects";
import { Container } from "@mui/material";

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
              color: "primary.main",
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
            }}
          >
            Explore our projects
          </Typography>
        </Box>
      </FadeIn>

      {/* Projects */}
      <FadeIn delay={100}>
        <Container maxWidth="lg" sx={{ mb: 8, mt: 10 }}>
          <Box component="section" sx={{ px: { xs: 3, md: 8 }, mx: "auto" }}>
            <GalleryGrid
              columns={{ xs: 1, md: 3 }}
              gap={3}
              items={PROJECTS.map((project, i) => (
                <FadeIn key={project.title} delay={i * 80}>
                  <ContentCard
                    tag={project.tag}
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

      {/* About Us */}
      <FadeIn delay={300}>
        <Container maxWidth="lg" sx={{ py: 10, px: { xs: 3, md: 8 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 6, md: 10 },
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
            <Box sx={{ flex: "0 0 65%" }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-tertiary)",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: "text.dark",
                  lineHeight: 1,
                }}
              >
                Discover
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  color: "primary.main",
                  mt: 0.5,
                  mb: 3,
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
    </Box>
  );
}
