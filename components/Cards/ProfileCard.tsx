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

export default function ProfileCard({
  avatarSrc,
  name,
  role,
  bio,
  github,
  website,
  sx,
}: ProfileCardProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, ...sx }}>
      {/* Card with image background and overlay */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "secondary.dark",
          "&:hover .profile-image": {
            transform: "scale(1.07)",
          },
          "&:hover .text-block": {
            transform: "translateY(-52px)",
          },
          "&:hover .bio-slide": {
            opacity: 1,
          },
        }}
      >
        {avatarSrc && (
          <Box
            className="profile-image"
            sx={{
              position: "absolute",
              inset: 0,
              transition: "transform 0.45s ease",
            }}
          >
            <Image
              src={avatarSrc}
              alt={name}
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>
        )}

        {/* Gradient overlay — always visible for name/role */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
          }}
        />

        {/* Bottom text — sits flush at bottom, shifts up on hover to reveal bio */}
        <Box
          className="text-block"
          sx={{
            position: "absolute",
            bottom: -50,
            left: 0,
            right: 0,
            p: 2.5,
            transform: "translateY(0)",
            transition: "transform 0.4s ease",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            color="white"
            lineHeight={1.2}
          >
            {name}
          </Typography>
          {role && (
            <Typography
              variant="body2"
              sx={{ mt: 0.4, fontWeight: 400 }}
            >
              {role}
            </Typography>
          )}
          {bio && (
            <Typography
              className="bio-slide"
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.75)",
                display: "block",
                mb: 0.75,
                opacity: 0,
                transition: "opacity 0.35s ease 0.05s",
              }}
            >
              {bio}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Icon buttons — left aligned */}
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {github && (
          <Tooltip title="GitHub" placement="top">
            <IconButton
              size="small"
              onClick={() => window.open(github, "_blank")}
              aria-label="GitHub"
              sx={{ color: "text.primary" }}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {website && (
          <Tooltip title="Personal Website" placement="top">
            <IconButton
              size="small"
              onClick={() => window.open(website, "_blank")}
              aria-label="Personal website"
              sx={{ color: "text.primary" }}
            >
              <LanguageIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
