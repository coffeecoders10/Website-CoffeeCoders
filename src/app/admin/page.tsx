"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import AdminDashboard from "./AdminDashboard";
import { Navbar, Footer } from "@components";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PWD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (authenticated) {
    return (
      <Box sx={{ bgcolor: "background.default" }}>
        <Navbar />
        <Box sx={{mt: 15 }}>
          <AdminDashboard />
        </Box>
        
        <Footer />
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
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              autoFocus
            />
            {error && <Alert severity="error">Incorrect password.</Alert>}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
