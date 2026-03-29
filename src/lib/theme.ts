"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    surface: string;
  }
  interface TypeText {
    dark: string;
  }
}

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
      main: "#c49b63",
      light: "#d4b484",
      dark: "#9a7440",
      contrastText: "#0D0D0D",
    },
    secondary: {
      main: "#693519",
      light: "#A16745",
      dark: "#492A17",
      contrastText: "#F5EDE6",
    },
    background: {
      default: "#0D0D0D",
      surface: "#2a2a2a",
    },
    text: {
      primary: "#F5EDE6",
      secondary: "#C4896A",
       dark: "#9a7440",
    },
    divider: "#492A17",
  },
  zIndex: {
    appBar: 1100,
  },
});

export default theme;
