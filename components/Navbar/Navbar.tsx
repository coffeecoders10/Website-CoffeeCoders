'use client';

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: "appBar",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease",
        bgcolor: scrolled ? "rgba(13, 13, 13, 0.6)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(73, 42, 23, 0.4)" : "none",
        borderBottom: "1px solid",
        borderColor: "background.surface",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.5 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
            <Image
              src="/coffeecoders_logo.png"
              alt="CoffeeCoders logo"
              width={72}
              height={72}
              loading="eager"
            />
            <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1, alignItems: "center" }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 400 }}>
                COFFEE
              </Typography>
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, letterSpacing: 6, mr: "-6px", lineHeight: 0.75 }}>
                CODERS
              </Typography>
            </Box>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
