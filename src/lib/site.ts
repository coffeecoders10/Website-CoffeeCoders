import { cache } from "react";
import { getSiteDetails } from "@/lib/backbone";
import defaultData from "@/constants/website-details.json";
import type { SiteData } from "@/app/HomeContent";

export const SITE_NAME = "CoffeeCoders";
export const SITE_TAGLINE = "The place where Caffeine creates Code";
export const SITE_DESCRIPTION =
  "CoffeeCoders is a small team of software developers that turns caffeine into code. Explore our live web apps, open-source projects and the people behind them.";

/** Canonical origin used for canonical URLs, sitemap and social cards. */
const SITE_URL = "https://coffeecoders.cc";

export function siteUrl(): string {
  return SITE_URL;
}

/** Site content for server rendering: Backbone first, bundled JSON on any failure. Memoized per request. */
export const getSiteData = cache(async (): Promise<SiteData> => {
  try {
    const { pjson } = await getSiteDetails<SiteData>();
    if (pjson) return pjson;
  } catch {
    // fall through to the bundled copy
  }
  return defaultData as SiteData;
});
