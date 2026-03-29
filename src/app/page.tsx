import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { FadeIn, Navbar } from "@components";

export default function Home() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
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
            minHeight: "100vh",
            px: 3,
            textAlign: "center",
            gap: 1,
          }}
        >
          <Image
            src="/coffeecoders_logo.png"
            alt="CoffeeCoders logo"
            width={80}
            height={80}
            style={{ marginBottom: "8px" }}
          />

          <Typography
            sx={{
              fontFamily: "var(--font-tertiary)",
              fontSize: { xs: "2rem", md: "2.75rem" },
              color: "text.secondary",
              lineHeight: 1.2,
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
              mb: 1,
            }}
          >
            CoffeeCoders
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              color: "text.secondary",
            }}
          >
            Explore our projects
          </Typography>
        </Box>
      </FadeIn>
    </Box>
  );
}
