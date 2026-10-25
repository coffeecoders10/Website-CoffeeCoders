"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import AdminDashboard from "./AdminDashboard";
import { Navbar, Footer } from "@components";
import defaultData from "@/constants/website-details.json";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socials, setSocials] = useState(defaultData.socials);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/session");
        setAuthenticated(res.ok);
      } catch {
        // stay signed out
      } finally {
        setChecking(false);
      }
    }
    checkSession();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/details");
        if (res.ok) {
          const json = await res.json();
          const pjson = json.pjson ?? json;
          if (pjson?.socials) setSocials(pjson.socials);
        }
      } catch {
        // keep default
      }
    }
    load();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setAuthenticated(true);
        setPassword("");
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Login failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setAuthenticated(false);
  }

  if (checking) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (authenticated) {
    return (
      <Box sx={{ bgcolor: "background.default" }}>
        <Navbar />
        <Box sx={{ mt: 15 }}>
          <AdminDashboard onLogout={handleLogout} />
        </Box>
        
        <Footer github={socials.github} email={socials.email} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Navbar />
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 500,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" sx={{fontWeight: 600, mb: 3, textTransform:"uppercase"}}>
            Admin Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              autoFocus
              autoComplete="username"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              autoComplete="current-password"
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={submitting}>
              Login
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer github={socials.github} email={socials.email} />
    </Box>
  );
}
