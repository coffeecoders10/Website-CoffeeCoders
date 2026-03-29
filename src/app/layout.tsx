import type { Metadata } from "next";
import { Poppins, Josefin_Sans, Great_Vibes } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "./providers";

// Primary font — Poppins (body, UI)
const poppins = Poppins({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Secondary font — Josefin Sans (headings, display)
const josefinSans = Josefin_Sans({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Tertiary font — Great Vibes (accent / decorative)
const greatVibes = Great_Vibes({
  variable: "--font-tertiary",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "CoffeeCoders",
  description: "CoffeeCoders Template",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${josefinSans.variable} ${greatVibes.variable}`}
    >
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
