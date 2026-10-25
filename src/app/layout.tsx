import type { Metadata, Viewport } from "next";
import { Poppins, Josefin_Sans, Great_Vibes } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Providers from "./providers";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteUrl } from "@/lib/site";
import "./globals.css";

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

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "CoffeeCoders",
    "Coffee Coders",
    "software developers",
    "web development",
    "full stack developers",
    "open source projects",
    "developer portfolio",
    "machine learning projects",
    "Nitish Talekar",
    "Sarvesh Wanode",
  ],
  authors: [
    { name: "Nitish Talekar", url: "https://ntidev.vercel.app" },
    { name: "Sarvesh Wanode", url: "https://sarveshwanode.vercel.app" },
  ],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
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
