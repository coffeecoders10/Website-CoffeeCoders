'use client';

import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import Link from "next/link";

export interface NavLink {
  label: string;
  /** In-page anchor such as "#projects" */
  href: string;
}

interface NavbarProps {
  /** In-page section links. Omit on pages without sections (e.g. admin). */
  links?: NavLink[];
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function Navbar({ links = [] }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const progressRef = useRef<HTMLDivElement>(null);

  // Glass background + reading-progress line
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 10);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Highlight the link of the section currently in the middle of the viewport
  useEffect(() => {
    if (!links.length) return;
    const targets = links
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [links]);

  // Escape closes the mobile menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const glass = scrolled || open;

  return (
    <Box
      component="nav"
      aria-label="Main"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: "appBar",
        transition: `background-color 0.4s ${EASE}, backdrop-filter 0.4s ${EASE}, border-color 0.4s ${EASE}`,
        bgcolor: glass ? "rgba(13, 13, 13, 0.72)" : "transparent",
        backdropFilter: glass ? "blur(14px)" : "none",
        WebkitBackdropFilter: glass ? "blur(14px)" : "none",
        borderBottom: "1px solid",
        borderColor: glass ? "divider" : "transparent",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: { xs: 1, md: 1.25 },
            transition: `padding 0.4s ${EASE}`,
          }}
        >
          <Link
            href="/"
            aria-label="CoffeeCoders home"
            style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}
          >
            <Image
              src="/coffeecoders_logo.png"
              alt=""
              width={64}
              height={64}
              loading="eager"
              style={{ width: scrolled ? 52 : 64, height: "auto", transition: `width 0.4s ${EASE}` }}
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

          {links.length > 0 && (
            <>
              {/* Desktop links */}
              <Box
                component="ul"
                sx={{ display: { xs: "none", md: "flex" }, listStyle: "none", gap: 4 }}
              >
                {links.map((link) => {
                  const isActive = active === link.href;
                  return (
                    <li key={link.href}>
                      <Box
                        component="a"
                        href={link.href}
                        aria-current={isActive ? "location" : undefined}
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          py: 1,
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          letterSpacing: "0.04em",
                          color: isActive ? "primary.main" : "text.primary",
                          transition: `color 0.3s ${EASE}`,
                          "&:hover": { color: "primary.main" },
                          // Underline grows from the left on hover, stays when active
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 2,
                            height: "1px",
                            bgcolor: "primary.main",
                            transformOrigin: "left",
                            transform: isActive ? "scaleX(1)" : "scaleX(0)",
                            transition: `transform 0.4s ${EASE}`,
                          },
                          "&:hover::after": { transform: "scaleX(1)" },
                        }}
                      >
                        {link.label}
                      </Box>
                    </li>
                  );
                })}
              </Box>

              {/* Mobile toggle */}
              <IconButton
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                sx={{ display: { xs: "inline-flex", md: "none" }, color: "text.primary", width: 48, height: 48 }}
              >
                {open ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </>
          )}
        </Box>

        {links.length > 0 && (
          <Collapse in={open} timeout={350} unmountOnExit sx={{ display: { md: "none" } }}>
            <Box id="mobile-menu" component="ul" sx={{ listStyle: "none", pb: 2 }}>
              {links.map((link) => (
                <li key={link.href}>
                  <Box
                    component="a"
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active === link.href ? "location" : undefined}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: 52,
                      px: 0.5,
                      fontSize: "1.1rem",
                      fontFamily: "var(--font-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: active === link.href ? "primary.main" : "text.primary",
                      borderTop: "1px solid",
                      borderColor: "divider",
                      WebkitTapHighlightColor: "transparent",
                      transition: `color 0.25s ${EASE}, padding-left 0.3s ${EASE}`,
                      "&:active": { color: "primary.main", pl: 1.5 },
                    }}
                  >
                    {link.label}
                  </Box>
                </li>
              ))}
            </Box>
          </Collapse>
        )}
      </Container>

      {/* Reading progress */}
      <Box
        ref={progressRef}
        aria-hidden="true"
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -1,
          height: 2,
          bgcolor: "primary.main",
          transformOrigin: "left",
          transform: "scaleX(0)",
          opacity: scrolled ? 0.8 : 0,
          transition: `opacity 0.4s ${EASE}`,
        }}
      />
    </Box>
  );
}
