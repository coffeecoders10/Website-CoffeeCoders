"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import AdminDashboard from "./AdminDashboard";

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
    return <AdminDashboard />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          bgcolor: "background.surface",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={1}>
          Admin Login
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter the admin password to continue.
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
      </Paper>
    </Box>
  );
}
