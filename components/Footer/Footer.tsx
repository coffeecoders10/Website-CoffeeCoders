'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import Image from 'next/image';

interface FooterProps {
  github: string;
  email: string;
}

export default function Footer({ github, email }: FooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        py: 5,
        px: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Image
              src="/coffeecoders_logo.png"
              alt="CoffeeCoders logo"
              width={32}
              height={32}
            />
            <Typography
              variant="h6"
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
            <IconButton
              component="a"
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              component="a"
              href={`mailto:${email}`}
              aria-label="Email"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <EmailIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} CoffeeCoders
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
