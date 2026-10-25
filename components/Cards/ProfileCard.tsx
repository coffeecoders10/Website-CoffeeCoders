"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { SxProps, Theme } from "@mui/material/styles";
import Image from "next/image";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";

export interface ProfileCardProps {
  avatarSrc?: string;
  name: string;
  role?: string;
  bio?: string;
  github?: string;
  website?: string;
  sx?: SxProps<Theme>;
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const iconSx = {
  color: "text.secondary",
  transition: `color 0.25s ${EASE}, transform 0.25s ${EASE}`,
  "&:hover": { color: "primary.main", transform: "translateY(-2px)" },
};

export default function ProfileCard({
  avatarSrc,
  name,
  role,
  bio,
  github,
  website,
  sx,
}: ProfileCardProps) {
  // Bio is revealed on hover/focus where those exist; on touch it is always shown.
  const reveal = {
    "& .profile-image": { transform: "scale(1.06)" },
    "& .bio-slide": { opacity: 1, maxHeight: 160 },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, ...sx }}>
      <Box
        tabIndex={bio ? 0 : undefined}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: { xs: "4 / 5", md: "3 / 4" },
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "secondary.dark",
          "@media (hover: hover)": {
            "&:hover": reveal,
          },
          "&:focus-visible": reveal,
          "@media (hover: none)": {
            "& .bio-slide": { opacity: 1, maxHeight: 160 },
          },
        }}
      >
        {avatarSrc && (
          <Box
            className="profile-image"
            sx={{
              position: "absolute",
              inset: 0,
              transition: `transform 0.7s ${EASE}`,
            }}
          >
            <Image
              src={avatarSrc}
              alt={name}
              fill
              sizes="(max-width: 900px) 100vw, 340px"
              style={{ objectFit: "cover" }}
            />
          </Box>
        )}

        {/* Gradient overlay: always visible so the name stays legible */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2.5,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="white" lineHeight={1.2}>
            {name}
          </Typography>
          {role && (
            <Typography variant="body2" sx={{ mt: 0.4, color: "primary.light" }}>
              {role}
            </Typography>
          )}
          {bio && (
            <Typography
              className="bio-slide"
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.82)",
                display: "block",
                mt: 1,
                lineHeight: 1.6,
                opacity: 0,
                maxHeight: 0,
                overflow: "hidden",
                transition: `opacity 0.45s ${EASE} 0.05s, max-height 0.5s ${EASE}`,
              }}
            >
              {bio}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 0.5 }}>
        {github && (
          <Tooltip title="GitHub" placement="top">
            <IconButton
              component="a"
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on GitHub`}
              sx={iconSx}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {website && (
          <Tooltip title="Personal website" placement="top">
            <IconButton
              component="a"
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} personal website`}
              sx={iconSx}
            >
              <LanguageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
