"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import defaultData from "@/constants/website-details.json";

// ── Types ────────────────────────────────────────────────────────────────────

interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatarSrc: string;
  github: string;
  website: string;
}

interface Project {
  title: string;
  body: string;
  cta: string;
  href?: string;
}

interface SiteData {
  socials: { github: string; email: string };
  about: string;
  stats: Stat[];
  team: TeamMember[];
  live_projects: Project[];
  projects: Project[];
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

// ── Field helper ─────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  multiline,
  type,
  width,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  width?: number | string;
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth={!width}
      sx={width ? { width } : undefined}
      size="small"
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      type={type}
      variant="outlined"
    />
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [data, setData] = useState<SiteData | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/details?id=1");
        if (res.ok) {
          const json = await res.json();
          setData(json.pjson ?? json);
        } else if (res.status === 404) {
          const createRes = await fetch("/api/details?id=1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(defaultData),
          });
          if (createRes.ok) {
            setData(defaultData as SiteData);
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

  async function handleSave() {
    if (!data) return;
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/details?id=1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pjson: data }),
      });
      setSaveStatus(res.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
  }

  // ── Updaters ───────────────────────────────────────────────────────────────

  function setSocials(field: keyof SiteData["socials"], value: string) {
    setData((d) => d && { ...d, socials: { ...d.socials, [field]: value } });
    setSaveStatus("idle");
  }

  function setAbout(value: string) {
    setData((d) => d && { ...d, about: value });
    setSaveStatus("idle");
  }

  function setStat(index: number, field: keyof Stat, value: string) {
    setData((d) => {
      if (!d) return d;
      const stats = d.stats.map((s, i) =>
        i !== index
          ? s
          : { ...s, [field]: field === "value" ? Number(value) : value || undefined }
      );
      return { ...d, stats };
    });
    setSaveStatus("idle");
  }

  function addStat() {
    setData((d) => d && { ...d, stats: [...d.stats, { label: "", value: 0 }] });
    setSaveStatus("idle");
  }

  function removeStat(index: number) {
    setData((d) => d && { ...d, stats: d.stats.filter((_, i) => i !== index) });
    setSaveStatus("idle");
  }

  function setTeamMember(index: number, field: keyof TeamMember, value: string) {
    setData((d) => {
      if (!d) return d;
      const team = d.team.map((m, i) => (i !== index ? m : { ...m, [field]: value }));
      return { ...d, team };
    });
    setSaveStatus("idle");
  }

  function addTeamMember() {
    setData(
      (d) =>
        d && {
          ...d,
          team: [...d.team, { name: "", role: "", bio: "", avatarSrc: "", github: "", website: "" }],
        }
    );
    setSaveStatus("idle");
  }

  function removeTeamMember(index: number) {
    setData((d) => d && { ...d, team: d.team.filter((_, i) => i !== index) });
    setSaveStatus("idle");
  }

  function setProject(section: "live_projects" | "projects", index: number, field: keyof Project, value: string) {
    setData((d) => {
      if (!d) return d;
      const list = d[section].map((p, i) => (i !== index ? p : { ...p, [field]: value }));
      return { ...d, [section]: list };
    });
    setSaveStatus("idle");
  }

  function addProject(section: "live_projects" | "projects") {
    setData(
      (d) =>
        d && { ...d, [section]: [...d[section], { title: "", body: "", cta: "", href: "" }] }
    );
    setSaveStatus("idle");
  }

  function removeProject(section: "live_projects" | "projects", index: number) {
    setData((d) => d && { ...d, [section]: d[section].filter((_, i) => i !== index) });
    setSaveStatus("idle");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

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

  if (!data) return null;

  return (
    <Box maxWidth={900} mx="auto" px={3} py={6}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} mb={0.5}>
          Admin Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Edit site content, then save.
        </Typography>
      </Box>

      {/* About */}
      <Accordion defaultExpanded disableGutters elevation={2} sx={{ mb: 1.5, borderRadius: "8px !important", "&:before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>About</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Field label="About text" value={data.about} onChange={setAbout} multiline />
        </AccordionDetails>
      </Accordion>

      {/* Live Projects */}
      <Accordion disableGutters elevation={2} sx={{ mb: 1.5, borderRadius: "8px !important", "&:before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Live Projects</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, alignSelf: "center" }}>
            ({data.live_projects.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ProjectsList
            items={data.live_projects}
            onAdd={() => addProject("live_projects")}
            onRemove={(i) => removeProject("live_projects", i)}
            onChange={(i, field, v) => setProject("live_projects", i, field, v)}
          />
        </AccordionDetails>
      </Accordion>

      {/* Projects */}
      <Accordion disableGutters elevation={2} sx={{ mb: 1.5, borderRadius: "8px !important", "&:before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Projects</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, alignSelf: "center" }}>
            ({data.projects.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ProjectsList
            items={data.projects}
            onAdd={() => addProject("projects")}
            onRemove={(i) => removeProject("projects", i)}
            onChange={(i, field, v) => setProject("projects", i, field, v)}
          />
        </AccordionDetails>
      </Accordion>

      {/* Stats */}
      <Accordion disableGutters elevation={2} sx={{ mb: 1.5, borderRadius: "8px !important", "&:before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Stats</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, alignSelf: "center" }}>
            ({data.stats.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
            {data.stats.map((stat, i) => (
              <Box key={i}>
                {i > 0 && <Divider sx={{ mb: 2 }} />}
                <Box display="flex" alignItems="center" gap={1}>
                  <Box flex={1} display="flex" gap={2}>
                    <Field label="Label" value={stat.label} onChange={(v) => setStat(i, "label", v)} />
                    <Field label="Value" value={stat.value} onChange={(v) => setStat(i, "value", v)} type="number" width={120} />
                    <Field label="Suffix" value={stat.suffix ?? ""} onChange={(v) => setStat(i, "suffix", v)} width={120} />
                  </Box>
                  <Tooltip title="Remove">
                    <IconButton size="small" onClick={() => removeStat(i)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
            <Box>
              <Button size="small" startIcon={<AddIcon />} onClick={addStat}>
                Add stat
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Team */}
      <Accordion disableGutters elevation={2} sx={{ mb: 1.5, borderRadius: "8px !important", "&:before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Team</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, alignSelf: "center" }}>
            ({data.team.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={1}>
            {data.team.map((member, i) => (
              <Box key={i} display="flex" alignItems="flex-start" gap={1}>
              <Accordion disableGutters elevation={1} sx={{ flex: 1, borderRadius: "6px !important", "&:before": { display: "none" } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body2" fontWeight={600}>
                    {member.name || `Member ${i + 1}`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" gap={2}>
                      <Field label="Name" value={member.name} onChange={(v) => setTeamMember(i, "name", v)} />
                      <Field label="Role" value={member.role} onChange={(v) => setTeamMember(i, "role", v)} />
                    </Box>
                    <Field label="Bio" value={member.bio} onChange={(v) => setTeamMember(i, "bio", v)} multiline />
                    <Box display="flex" gap={2}>
                      <Field label="Avatar path" value={member.avatarSrc} onChange={(v) => setTeamMember(i, "avatarSrc", v)} />
                      <Field label="GitHub URL" value={member.github} onChange={(v) => setTeamMember(i, "github", v)} />
                      <Field label="Website URL" value={member.website} onChange={(v) => setTeamMember(i, "website", v)} />
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
              <Tooltip title="Remove">
                <IconButton size="small" onClick={() => removeTeamMember(i)} sx={{ mt: 0.5 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              </Box>
            ))}
            <Box mt={1}>
              <Button size="small" startIcon={<AddIcon />} onClick={addTeamMember}>
                Add member
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Socials */}
      <Accordion disableGutters elevation={2} sx={{ mb: 1.5, borderRadius: "8px !important", "&:before": { display: "none" } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={600}>Socials</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
            <Field label="GitHub URL" value={data.socials.github} onChange={(v) => setSocials("github", v)} />
            <Field label="Email" value={data.socials.email} onChange={(v) => setSocials("email", v)} />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Bottom save */}
      <Box mt={4} display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "website-details.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download JSON
        </Button>
        <Box display="flex" alignItems="center" gap={2}>
        {saveStatus === "saved" && <Alert severity="success" sx={{ py: 0 }}>Saved!</Alert>}
        {saveStatus === "error" && <Alert severity="error" sx={{ py: 0 }}>Save failed.</Alert>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          startIcon={saveStatus === "saving" ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {saveStatus === "saving" ? "Saving…" : "Save"}
        </Button>
        </Box>
      </Box>
    </Box>
  );
}

// ── ProjectsList ─────────────────────────────────────────────────────────────

function ProjectsList({
  items,
  onAdd,
  onRemove,
  onChange,
}: {
  items: Project[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onChange: (i: number, field: keyof Project, value: string) => void;
}) {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {items.map((project, i) => (
        <Box key={i} display="flex" alignItems="flex-start" gap={1}>
        <Accordion disableGutters elevation={1} sx={{ flex: 1, borderRadius: "6px !important", "&:before": { display: "none" } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight={600}>
              {project.title || `Project ${i + 1}`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Title"
                value={project.title}
                onChange={(e) => onChange(i, "title", e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="Body"
                value={project.body}
                onChange={(e) => onChange(i, "body", e.target.value)}
                fullWidth
                size="small"
                multiline
                minRows={2}
              />
              <TextField
                label="Link (href, optional)"
                value={project.href ?? ""}
                onChange={(e) => onChange(i, "href", e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="CTA label"
                value={project.cta}
                onChange={(e) => onChange(i, "cta", e.target.value)}
                fullWidth
                size="small"
              />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Tooltip title="Remove">
          <IconButton size="small" onClick={() => onRemove(i)} sx={{ mt: 0.5 }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        </Box>
      ))}
      <Box mt={1}>
        <Button size="small" startIcon={<AddIcon />} onClick={onAdd}>
          Add project
        </Button>
      </Box>
    </Box>
  );
}
