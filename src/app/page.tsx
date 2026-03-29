import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";

import { FadeIn } from "@/components";
import DemoSections from "./DemoSections";

export default function Home() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Image
            src="/coffeecoders_logo.png"
            alt="CoffeeCoders logo"
            width={36}
            height={36}
          />
          <Typography variant="h6" component="div">
            CoffeeCoders
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Hero — FadeIn on load */}
      <FadeIn onLoadOnly delay={100}>
        <Box
          component="section"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 64px)",
            px: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "2.5rem", md: "4rem" }, mb: 2 }}
          >
            TITLE
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
          >
            Subtitle
          </Typography>
        </Box>
      </FadeIn>

      {/* All interactive demo sections */}
      <DemoSections />
    </Box>
  );
}
