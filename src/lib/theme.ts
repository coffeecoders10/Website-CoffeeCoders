"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-primary), sans-serif",
    h1: { fontFamily: "var(--font-secondary), sans-serif" },
    h2: { fontFamily: "var(--font-secondary), sans-serif" },
    h3: { fontFamily: "var(--font-secondary), sans-serif" },
    h4: { fontFamily: "var(--font-secondary), sans-serif" },
    h5: { fontFamily: "var(--font-secondary), sans-serif" },
    h6: { fontFamily: "var(--font-secondary), sans-serif" },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#A16745",
      light: "#C4896A",
      dark: "#693519",
      contrastText: "#F5EDE6",
    },
    secondary: {
      main: "#693519",
      light: "#A16745",
      dark: "#492A17",
      contrastText: "#F5EDE6",
    },
    background: {
      default: "#0D0D0D",
      paper: "#1A1209",
    },
    text: {
      primary: "#F5EDE6",
      secondary: "#C4896A",
    },
    divider: "#492A17",
  },
  zIndex: {
    appBar: 1100,
  },
});

export default theme;
