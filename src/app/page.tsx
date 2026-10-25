import HomeContent from "./HomeContent";
import { getSiteData, siteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default async function Home() {
  const data = await getSiteData();
  const url = siteUrl();

  // Structured data: lets Google show the organisation, its logo and its people in rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: SITE_NAME,
        url,
        logo: { "@type": "ImageObject", url: `${url}/coffeecoders_logo.png`, width: 1637, height: 1637 },
        description: SITE_DESCRIPTION,
        email: data.socials.email,
        sameAs: [data.socials.github],
        founder: data.team.map((m) => ({ "@id": `${url}/#person-${encodeURIComponent(m.name)}` })),
      },
      ...data.team.map((m) => ({
        "@type": "Person",
        "@id": `${url}/#person-${encodeURIComponent(m.name)}`,
        name: m.name,
        jobTitle: m.role,
        description: m.bio,
        worksFor: { "@id": `${url}/#organization` },
        ...(m.avatarSrc && { image: `${url}${m.avatarSrc}` }),
        sameAs: [m.github, m.website].filter(Boolean),
      })),
      {
        "@type": "ItemList",
        name: "CoffeeCoders projects",
        itemListElement: [...data.live_projects, ...data.projects].map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title,
          description: p.body,
          ...(p.href && { url: p.href }),
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so content can never close the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomeContent data={data} />
    </>
  );
}
