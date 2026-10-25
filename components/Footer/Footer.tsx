'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import Image from 'next/image';

interface FooterProps {
  github: string;
  email: string;
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const iconSx = {
  width: 48,
  height: 48,
  color: 'text.secondary',
  transition: `color 0.25s ${EASE}, transform 0.25s ${EASE}, background-color 0.25s ${EASE}`,
  '&:hover': { color: 'primary.main', transform: 'translateY(-2px)' },
};

export default function Footer({ github, email }: FooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        py: { xs: 4, md: 5 },
        px: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 2, md: 3 },
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Image
              src="/coffeecoders_logo.png"
              alt=""
              width={32}
              height={32}
            />
            <Typography
              variant="h6"
              component="p"
              sx={{
                color: 'primary.main',
                fontFamily: 'var(--font-secondary)',
                letterSpacing: 2,
              }}
            >
              COFFEECODERS
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="GitHub" placement="top">
              <IconButton
                component="a"
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CoffeeCoders on GitHub"
                sx={iconSx}
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Email us" placement="top">
              <IconButton
                component="a"
                href={`mailto:${email}`}
                aria-label="Email CoffeeCoders"
                sx={iconSx}
              >
                <EmailIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} CoffeeCoders
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
