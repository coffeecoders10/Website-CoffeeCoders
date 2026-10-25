'use client';

import { useState, useEffect, useRef, ReactNode } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import Link from "next/link";

export interface NavLink {
  label: string;
  /** In-page anchor such as "#projects" */
  href: string;
  /** Shown instead of the text on small screens */
  icon?: ReactNode;
}

interface NavbarProps {
  /** In-page section links. Omit on pages without sections (e.g. admin). */
  links?: NavLink[];
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function Navbar({ links = [] }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
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

  const glass = scrolled;

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
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}
          >
            <Image
              src="/coffeecoders_logo.png"
              alt=""
              width={64}
              height={64}
              loading="eager"
              style={{ width: scrolled ? 44 : 52, height: "auto", transition: `width 0.4s ${EASE}` }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1, alignItems: "center" }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 400, fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
                COFFEE
              </Typography>
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, letterSpacing: { xs: 4, md: 6 }, mr: { xs: "-4px", md: "-6px" }, fontSize: { xs: "0.85rem", md: "1rem" }, lineHeight: 0.75 }}>
                CODERS
              </Typography>
            </Box>
          </Link>

          {links.length > 0 && (
            <Box
              component="ul"
              sx={{ display: "flex", listStyle: "none", gap: { xs: 0, md: 4 }, alignItems: "center" }}
            >
              {links.map((link) => {
                const isActive = active === link.href;
                return (
                  <li key={link.href}>
                    <Tooltip title={link.label} placement="bottom" enterTouchDelay={400}>
                      <Box
                        component="a"
                        href={link.href}
                        aria-label={link.label}
                        aria-current={isActive ? "location" : undefined}
                        sx={{
                          position: "relative",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: { xs: 40, md: 0 },
                          height: { xs: 44, md: "auto" },
                          py: { md: 1 },
                          fontSize: "0.95rem",
                          fontWeight: 500,
                          letterSpacing: "0.04em",
                          color: isActive ? "primary.main" : "text.primary",
                          WebkitTapHighlightColor: "transparent",
                          transition: `color 0.3s ${EASE}, transform 0.3s ${EASE}`,
                          "&:hover": { color: "primary.main" },
                          "&:active": { transform: "scale(0.92)" },
                          // Underline grows from the left on hover, stays when active
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            left: { xs: 8, md: 0 },
                            right: { xs: 8, md: 0 },
                            bottom: { xs: 4, md: 2 },
                            height: "1px",
                            bgcolor: "primary.main",
                            transformOrigin: "left",
                            transform: isActive ? "scaleX(1)" : "scaleX(0)",
                            transition: `transform 0.4s ${EASE}`,
                          },
                          "@media (hover: hover)": { "&:hover::after": { transform: "scaleX(1)" } },
                        }}
                      >
                        {/* Icons on phones, text from tablet up */}
                        {link.icon && (
                          <Box component="span" sx={{ display: { xs: "inline-flex", md: "none" }, lineHeight: 0 }}>
                            {link.icon}
                          </Box>
                        )}
                        <Box
                          component="span"
                          sx={{ display: { xs: link.icon ? "none" : "inline", md: "inline" } }}
                        >
                          {link.label}
                        </Box>
                      </Box>
                    </Tooltip>
                  </li>
                );
              })}
            </Box>
          )}
        </Box>

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
