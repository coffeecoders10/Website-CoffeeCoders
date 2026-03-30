"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import defaultData from "@/constants/website-details.json";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [raw, setRaw] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/details?id=1");
        if (res.ok) {
          const json = await res.json();
          setRaw(JSON.stringify(json, null, 2));
        } else if (res.status === 404) {
          const createRes = await fetch("/api/details?id=1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(defaultData),
          });
          if (createRes.ok) {
            setRaw(JSON.stringify(defaultData, null, 2));
          } else {
            setFetchError("Failed to create initial data.");
          }
        } else {
          setFetchError(`Unexpected response: ${res.status}`);
        }
      } catch {
        setFetchError("Network error while loading data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(value: string) {
    setRaw(value);
    setParseError(null);
    setSaveStatus("idle");
    try {
      JSON.parse(value);
    } catch {
      setParseError("Invalid JSON");
    }
  }

  async function handleSave() {
    try {
      const parsed = JSON.parse(raw);
      setSaveStatus("saving");
      const res = await fetch("/api/details?id=1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      setSaveStatus(res.ok ? "saved" : "error");
    } catch {
      setParseError("Invalid JSON — fix before saving.");
    }
  }

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box p={4}>
        <Alert severity="error">{fetchError}</Alert>
      </Box>
    );
  }

  return (
    <Box maxWidth={900} mx="auto" px={3} py={6}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Admin Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Edit the site data as JSON and save.
      </Typography>

      <Paper elevation={2} sx={{ bgcolor: "background.surface", borderRadius: 2, overflow: "hidden" }}>
        <textarea
          value={raw}
          onChange={(e) => handleChange(e.target.value)}
          spellCheck={false}
          style={{
            width: "100%",
            minHeight: 600,
            padding: "16px",
            fontFamily: "monospace",
            fontSize: "13px",
            lineHeight: 1.6,
            background: "transparent",
            color: "inherit",
            border: "none",
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </Paper>

      <Box mt={2} display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!!parseError || saveStatus === "saving"}
          startIcon={saveStatus === "saving" ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {saveStatus === "saving" ? "Saving…" : "Save"}
        </Button>
        {parseError && <Alert severity="warning" sx={{ py: 0 }}>{parseError}</Alert>}
        {saveStatus === "saved" && <Alert severity="success" sx={{ py: 0 }}>Saved!</Alert>}
        {saveStatus === "error" && <Alert severity="error" sx={{ py: 0 }}>Save failed.</Alert>}
      </Box>
    </Box>
  );
}
