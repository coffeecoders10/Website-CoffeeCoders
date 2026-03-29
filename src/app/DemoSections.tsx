'use client';

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import {
  FadeIn,
  GalleryGrid,
  Carousel,
  ContentCard,
  StatCard,
  ProfileCard,
} from "@/components";

function DemoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <FadeIn>
      <Box
        component="section"
        sx={{ py: 8, px: { xs: 3, md: 8 }, maxWidth: 1100, mx: "auto" }}
      >
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Divider sx={{ mb: 4, mt: 0.5 }} />
        {children}
      </Box>
    </FadeIn>
  );
}

// Gallery items — use theme palette tokens via sx
const GALLERY_ITEMS = [
  "primary.dark",
  "primary.main",
  "primary.light",
  "secondary.dark",
  "secondary.main",
  "secondary.light",
  "background.paper",
  "primary.dark",
  "primary.main",
].map((color, i) => (
  <Box
    key={i}
    sx={{
      aspectRatio: "4/3",
      borderRadius: 2,
      bgcolor: color,
      border: "1px solid",
      borderColor: "divider",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography variant="h6" color="text.primary">
      {i + 1}
    </Typography>
  </Box>
));

// Carousel slides — use theme palette tokens
const CAROUSEL_SLIDES = (
  [
    { bg: "primary.dark", label: "Slide 1" },
    { bg: "secondary.dark", label: "Slide 2" },
    { bg: "primary.main", label: "Slide 3" },
  ] as const
).map(({ bg, label }, i) => (
  <Box
    key={i}
    sx={{
      height: 220,
      borderRadius: 2,
      bgcolor: bg,
      border: "1px solid",
      borderColor: "divider",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography variant="h5" color="text.primary">
      {label}
    </Typography>
  </Box>
));

export default function DemoSections() {
  return (
    <>
      {/* Cards */}
      <DemoSection title="Cards">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: 3,
          }}
        >
          <FadeIn delay={200}>
            <ContentCard
              tag="Feature"
              title="Content Card"
              body="A text-first card with an accent border, tag chip, and a CTA."
              cta="Learn more"
              onCtaClick={() => {}}
            />
          </FadeIn>
          <FadeIn delay={400}>
            <StatCard
              label="Total Users"
              value="12,480"
              trend="+8.3%"
              trendDirection="positive"
              icon="☕"
            />
          </FadeIn>
          <FadeIn delay={600}>
            <ProfileCard
              name="Jane Doe"
              role="Lead Designer"
              bio="Crafting beautiful interfaces one pixel at a time."
              actions={[
                { label: "Follow", onClick: () => {}, variant: "contained" },
                { label: "Message", onClick: () => {}, variant: "outlined" },
              ]}
            />
          </FadeIn>
        </Box>
      </DemoSection>

      {/* Gallery Grid — numbered pagination */}
      <DemoSection title="Gallery Grid — numbered pagination">
        <GalleryGrid
          items={GALLERY_ITEMS}
          columns={3}
          rows={2}
          pagination
          paginationDots={false}
        />
      </DemoSection>

      {/* Gallery Grid — dot pagination */}
      <DemoSection title="Gallery Grid — dot pagination">
        <GalleryGrid
          items={GALLERY_ITEMS}
          columns={3}
          rows={2}
          pagination
          paginationDots
        />
      </DemoSection>

      {/* Carousel — interaction mode */}
      <DemoSection title="Carousel — interaction mode">
        <Carousel slides={CAROUSEL_SLIDES} mode="interaction" showDots showArrows />
      </DemoSection>

      {/* Carousel — continuous mode */}
      <DemoSection title="Carousel — continuous mode (hover to pause)">
        <Carousel
          slides={CAROUSEL_SLIDES}
          mode="continuous"
          continuousDuration={8000}
          gap={24}
        />
      </DemoSection>
    </>
  );
}
