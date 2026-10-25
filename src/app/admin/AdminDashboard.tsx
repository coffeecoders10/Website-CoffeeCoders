"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  TextField,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { CoffeeIcon, COFFEE_ICON_TYPES, ContentCard, ProfileCard } from "@components";
import defaultData from "@/constants/website-details.json";

// ── Types ────────────────────────────────────────────────────────────────────

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
  href?: string;
  /** CoffeeIcon name; blank = automatic */
  icon?: string;
}

interface SiteData {
  socials: { github: string; email: string };
  about: string;
  team: TeamMember[];
  live_projects: Project[];
  projects: Project[];
}

type SaveStatus = "idle" | "saving" | "saved" | "error";
type SectionKey = "about" | "live_projects" | "projects" | "team" | "socials";
type ListKey = "live_projects" | "projects" | "team";
type IconName = (typeof COFFEE_ICON_TYPES)[number];

const SECTIONS: { key: SectionKey; label: string; hint: string; icon: ReactNode }[] = [
  { key: "about", label: "About", hint: "The story on the home page", icon: <InfoOutlinedIcon fontSize="small" /> },
  { key: "live_projects", label: "Live projects", hint: "Running and open to visit", icon: <RocketLaunchOutlinedIcon fontSize="small" /> },
  { key: "projects", label: "Projects", hint: "Everything else we have built", icon: <FolderOutlinedIcon fontSize="small" /> },
  { key: "team", label: "Team", hint: "The people behind the code", icon: <GroupsOutlinedIcon fontSize="small" /> },
  { key: "socials", label: "Socials", hint: "Footer links", icon: <AlternateEmailIcon fontSize="small" /> },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Stats are calculated on the site now; drop any old `stats` still stored in the document. */
function withoutLegacyStats(data: SiteData) {
  const doc: Record<string, unknown> = { ...data };
  delete doc.stats;
  return doc;
}

function sectionCount(data: SiteData, key: SectionKey): number | null {
  if (key === "live_projects" || key === "projects" || key === "team") return data[key].length;
  return null;
}

// ── Field helper ─────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  multiline,
  minRows,
  helper,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  minRows?: number;
  helper?: string;
  placeholder?: string;
}) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
      multiline={multiline}
      minRows={multiline ? (minRows ?? 3) : undefined}
      helperText={helper}
      placeholder={placeholder}
      variant="outlined"
    />
  );
}

// ── IconPicker ───────────────────────────────────────────────────────────────

const ICON_LABELS: Record<IconName, string> = {
  mug: "Mug",
  takeaway: "Takeaway cup",
  espresso: "Espresso",
  frenchPress: "French press",
  flask: "Flask",
  moka: "Moka pot",
  pourOver: "Pour-over",
  latte: "Latte glass",
};

/** Pick which coffee vessel a project card shows. "Auto" leaves it to the site to cycle. */
function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options: { id: string; label: string }[] = [
    { id: "", label: "Auto" },
    ...COFFEE_ICON_TYPES.map((t) => ({ id: t, label: ICON_LABELS[t] })),
  ];
  return (
    <Box role="group" aria-label="Card icon">
      <Typography variant="body2" color="text.secondary" mb={1}>
        Card icon
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(88px, 1fr))" gap={1}>
        {options.map((o) => {
          const selected = value === o.id;
          return (
            <Box
              key={o.id || "auto"}
              component="button"
              type="button"
              onClick={() => onChange(o.id)}
              aria-pressed={selected}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                minHeight: 84,
                p: 1,
                font: "inherit",
                cursor: "pointer",
                borderRadius: 2,
                border: "1px solid",
                borderColor: selected ? "primary.main" : "divider",
                bgcolor: selected ? "rgba(196,155,99,0.12)" : "transparent",
                color: selected ? "primary.main" : "text.secondary",
                transition: `border-color 0.25s ${EASE}, background-color 0.25s ${EASE}, color 0.25s ${EASE}`,
                "&:hover": { borderColor: "secondary.light", color: "primary.light" },
              }}
            >
              {o.id ? (
                <Box sx={{ lineHeight: 0 }}>
                  <CoffeeIcon type={o.id as IconName} size={36} />
                </Box>
              ) : (
                <Typography sx={{ fontSize: "1.3rem", lineHeight: "36px" }} aria-hidden="true">
                  ✦
                </Typography>
              )}
              <Typography variant="caption" sx={{ lineHeight: 1.2, textAlign: "center" }}>
                {o.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// ── Master/detail editor (list on the left, one open record on the right) ────

function MasterDetail<T>({
  noun,
  items,
  getTitle,
  getThumb,
  onAdd,
  onRemove,
  onMove,
  renderEditor,
  renderPreview,
}: {
  noun: string;
  items: T[];
  getTitle: (item: T, i: number) => string;
  getThumb: (item: T, i: number) => ReactNode;
  onAdd: () => void;
  onRemove: (i: number) => void;
  onMove: (i: number, dir: -1 | 1) => void;
  renderEditor: (item: T, i: number) => ReactNode;
  renderPreview: (item: T, i: number) => ReactNode;
}) {
  const [selected, setSelected] = useState(0);

  const index = Math.min(selected, Math.max(items.length - 1, 0));
  const current = items[index];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(260px, 320px) 1fr" },
        gap: 3,
        alignItems: "start",
      }}
    >
      {/* List */}
      <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
        <Box component="ul" aria-label={`${noun}s`} sx={{ listStyle: "none", m: 0, p: 0, maxHeight: { lg: "60vh" }, overflowY: "auto" }}>
          {items.map((item, i) => {
            const active = i === index;
            return (
              <Box
                component="li"
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  bgcolor: active ? "rgba(196,155,99,0.1)" : "transparent",
                  boxShadow: active ? (t) => `inset 3px 0 0 ${t.palette.primary.main}` : "none",
                  "&:last-of-type": { borderBottom: 0 },
                }}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-current={active ? "true" : undefined}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 56,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1,
                    font: "inherit",
                    textAlign: "left",
                    cursor: "pointer",
                    border: 0,
                    bgcolor: "transparent",
                    color: active ? "text.primary" : "text.secondary",
                    transition: `color 0.25s ${EASE}, background-color 0.25s ${EASE}`,
                    "&:hover": { color: "text.primary", bgcolor: "rgba(161,103,69,0.08)" },
                  }}
                >
                  <Box sx={{ lineHeight: 0, flexShrink: 0 }}>{getThumb(item, i)}</Box>
                  <Typography variant="body2" noWrap fontWeight={active ? 600 : 400}>
                    {getTitle(item, i) || `Untitled ${noun}`}
                  </Typography>
                </Box>
                {active && (
                  <Box sx={{ display: "flex", pr: 0.5 }}>
                    <Tooltip title="Move up">
                      <span>
                        <IconButton size="small" aria-label={`Move ${noun} up`} disabled={i === 0} onClick={() => onMove(i, -1)}>
                          <ArrowUpwardIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Move down">
                      <span>
                        <IconButton size="small" aria-label={`Move ${noun} down`} disabled={i === items.length - 1} onClick={() => onMove(i, 1)}>
                          <ArrowDownwardIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            );
          })}
          {items.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
              No {noun}s yet. Add the first one.
            </Typography>
          )}
        </Box>
        <Divider />
        <Button
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => {
            onAdd();
            setSelected(items.length); // open the new record so the user can fill it in
          }}
          sx={{ minHeight: 48, borderRadius: 0 }}>
          Add {noun}
        </Button>
      </Box>

      {/* Editor + live preview */}
      {current && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) minmax(260px, 340px)" },
            gap: 4,
            alignItems: "start",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
                Edit {noun}
              </Typography>
              <Tooltip title={`Remove ${noun}`}>
                <IconButton
                  aria-label={`Remove ${noun}`}
                  onClick={() => onRemove(index)}
                  sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            {renderEditor(current, index)}
          </Box>
          <Box sx={{ position: { xl: "sticky" }, top: { xl: 190 } }}>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Preview
            </Typography>
            {renderPreview(current, index)}
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function AdminDashboard({ onLogout }: { onLogout?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [data, setData] = useState<SiteData | null>(null);
  const [saved, setSaved] = useState<SiteData | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [section, setSection] = useState<SectionKey>("about");
  const [undo, setUndo] = useState<{ label: string; snapshot: SiteData } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/details");
        if (res.ok) {
          const json = await res.json();
          const doc = (json.pjson ?? json) as SiteData;
          setData(doc);
          setSaved(doc);
        } else if (res.status === 404) {
          // The server seeds the row from the bundled JSON.
          const createRes = await fetch("/api/details", { method: "POST" });
          if (createRes.ok) {
            setData(defaultData as SiteData);
            setSaved(defaultData as SiteData);
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

  // Which sections differ from what is stored.
  const dirty = useMemo(() => {
    const out = new Set<SectionKey>();
    if (!data || !saved) return out;
    for (const { key } of SECTIONS) {
      if (JSON.stringify(data[key]) !== JSON.stringify(saved[key])) out.add(key);
    }
    return out;
  }, [data, saved]);
  const hasChanges = dirty.size > 0;

  const handleSave = useCallback(async () => {
    if (!data || saveStatus === "saving") return;
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pjson: withoutLegacyStats(data) }),
      });
      if (res.ok) setSaved(data);
      setSaveStatus(res.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
  }, [data, saveStatus]);

  // Ctrl/Cmd+S saves; leaving with unsaved edits asks first.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (hasChanges) handleSave();
      }
    }
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (hasChanges) e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [hasChanges, handleSave]);

  function update(fn: (d: SiteData) => SiteData) {
    setData((d) => (d ? fn(d) : d));
    setSaveStatus("idle");
  }

  function discard() {
    if (saved) update(() => saved);
  }

  function downloadJson() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website-details.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── List helpers (one set for projects and team) ───────────────────────────

  function setItem<K extends ListKey>(key: K, index: number, field: string, value: string) {
    update((d) => ({
      ...d,
      [key]: (d[key] as object[]).map((item, i) => (i !== index ? item : { ...item, [field]: value })),
    }));
  }

  function addItem(key: ListKey) {
    const blank = key === "team"
      ? { name: "", role: "", bio: "", avatarSrc: "", github: "", website: "" }
      : { title: "", body: "", href: "", icon: "" };
    update((d) => ({ ...d, [key]: [...(d[key] as object[]), blank] }));
  }

  function removeItem(key: ListKey, index: number, label: string) {
    if (!data) return;
    setUndo({ label, snapshot: data });
    update((d) => ({ ...d, [key]: (d[key] as object[]).filter((_, i) => i !== index) }));
  }

  function moveItem(key: ListKey, index: number, dir: -1 | 1) {
    update((d) => {
      const list = [...(d[key] as object[])];
      const to = index + dir;
      if (to < 0 || to >= list.length) return d;
      [list[index], list[to]] = [list[to], list[index]];
      return { ...d, [key]: list };
    });
  }

  // ── Section bodies ─────────────────────────────────────────────────────────

  function renderProjects(key: "live_projects" | "projects") {
    if (!data) return null;
    return (
      <MasterDetail<Project>
        noun="project"
        items={data[key]}
        getTitle={(p) => p.title}
        getThumb={(p, i) => <CoffeeIcon type={(p.icon || i) as IconName | number} size={28} />}
        onAdd={() => addItem(key)}
        onRemove={(i) => removeItem(key, i, "Project removed")}
        onMove={(i, dir) => moveItem(key, i, dir)}
        renderEditor={(p, i) => (
          <>
            <Field label="Title" value={p.title} onChange={(v) => setItem(key, i, "title", v)} />
            <Field label="Description" value={p.body} onChange={(v) => setItem(key, i, "body", v)} multiline minRows={3} />
            <Field
              label="Link"
              value={p.href ?? ""}
              onChange={(v) => setItem(key, i, "href", v)}
              placeholder="https://"
              helper="Optional. When set, the whole card opens this link in a new tab."
            />
            <IconPicker value={p.icon ?? ""} onChange={(v) => setItem(key, i, "icon", v)} />
          </>
        )}
        renderPreview={(p, i) => (
          <ContentCard
            title={p.title || "Untitled project"}
            body={p.body}
            href={p.href || undefined}
            icon={(p.icon || i) as IconName | number}
          />
        )}
      />
    );
  }

  function renderSection() {
    if (!data) return null;
    switch (section) {
      case "about":
        return (
          <Box sx={{ maxWidth: 760, display: "flex", flexDirection: "column", gap: 1 }}>
            <Field label="About text" value={data.about} onChange={(v) => update((d) => ({ ...d, about: v }))} multiline minRows={10} />
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "flex-end" }}>
              {data.about.length} characters
            </Typography>
          </Box>
        );
      case "live_projects":
        return renderProjects("live_projects");
      case "projects":
        return renderProjects("projects");
      case "team":
        return (
          <MasterDetail<TeamMember>
            noun="member"
            items={data.team}
            getTitle={(m) => m.name}
            getThumb={(m) => (
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "secondary.dark",
                  backgroundImage: m.avatarSrc ? `url(${m.avatarSrc})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                }}
              />
            )}
            onAdd={() => addItem("team")}
            onRemove={(i) => removeItem("team", i, "Member removed")}
            onMove={(i, dir) => moveItem("team", i, dir)}
            renderEditor={(m, i) => (
              <>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                  <Field label="Name" value={m.name} onChange={(v) => setItem("team", i, "name", v)} />
                  <Field label="Role" value={m.role} onChange={(v) => setItem("team", i, "role", v)} />
                </Box>
                <Field label="Bio" value={m.bio} onChange={(v) => setItem("team", i, "bio", v)} multiline minRows={4} />
                <Field
                  label="Photo path"
                  value={m.avatarSrc}
                  onChange={(v) => setItem("team", i, "avatarSrc", v)}
                  placeholder="/name-profile.jpg"
                  helper="A file in the public folder."
                />
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                  <Field label="GitHub URL" value={m.github} onChange={(v) => setItem("team", i, "github", v)} />
                  <Field label="Website URL" value={m.website} onChange={(v) => setItem("team", i, "website", v)} />
                </Box>
              </>
            )}
            renderPreview={(m) => (
              <ProfileCard
                avatarSrc={m.avatarSrc || undefined}
                name={m.name || "Name"}
                role={m.role}
                bio={m.bio}
                github={m.github || undefined}
                website={m.website || undefined}
              />
            )}
          />
        );
      case "socials":
        return (
          <Box sx={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Field
              label="GitHub URL"
              value={data.socials.github}
              onChange={(v) => update((d) => ({ ...d, socials: { ...d.socials, github: v } }))}
            />
            <Field
              label="Email"
              value={data.socials.email}
              onChange={(v) => update((d) => ({ ...d, socials: { ...d.socials, email: v } }))}
              helper="Shown as the mail icon in the footer."
            />
          </Box>
        );
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
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

  const active = SECTIONS.find((s) => s.key === section)!;

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, pb: 10 }}>
      {/* Sticky action bar */}
      <Box
        sx={{
          position: "sticky",
          top: 72,
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          py: 1.5,
          mb: 3,
          bgcolor: "rgba(13,13,13,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 180 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
            Site content
          </Typography>
          <Typography variant="caption" color="text.secondary" role="status" aria-live="polite">
            {saveStatus === "saving"
              ? "Saving…"
              : saveStatus === "error"
                ? "Save failed. Your edits are still here; try again."
                : hasChanges
                  ? `Unsaved changes in ${dirty.size} ${dirty.size === 1 ? "section" : "sections"}`
                  : saveStatus === "saved"
                    ? "All changes saved"
                    : "Up to date"}
          </Typography>
        </Box>
        <Tooltip title="Download JSON">
          <IconButton aria-label="Download JSON" onClick={downloadJson}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        {onLogout && (
          <Tooltip title="Log out">
            <IconButton aria-label="Log out" onClick={onLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        )}
        <Button onClick={discard} disabled={!hasChanges || saveStatus === "saving"}>
          Discard changes
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!hasChanges || saveStatus === "saving"}
          startIcon={saveStatus === "saving" ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {saveStatus === "saving" ? "Saving…" : "Save changes"}
        </Button>
      </Box>

      {saveStatus === "error" && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Could not save. Check your connection and try again.
        </Alert>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "220px 1fr" }, gap: { xs: 2, md: 5 }, alignItems: "start" }}>
        {/* Section nav: left rail on desktop, scrolling tabs on phones */}
        <Box
          component="nav"
          aria-label="Content sections"
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            gap: 0.5,
            overflowX: { xs: "auto", md: "visible" },
            position: { md: "sticky" },
            top: { md: 190 },
          }}
        >
          {SECTIONS.map((s) => {
            const selected = s.key === section;
            const count = sectionCount(data, s.key);
            return (
              <Box
                key={s.key}
                component="button"
                type="button"
                onClick={() => setSection(s.key)}
                aria-current={selected ? "page" : undefined}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minHeight: 44,
                  px: 1.5,
                  py: 1,
                  flexShrink: 0,
                  font: "inherit",
                  fontSize: "0.9rem",
                  textAlign: "left",
                  cursor: "pointer",
                  border: 0,
                  borderRadius: 2,
                  whiteSpace: "nowrap",
                  bgcolor: selected ? "rgba(196,155,99,0.12)" : "transparent",
                  color: selected ? "primary.main" : "text.secondary",
                  transition: `color 0.25s ${EASE}, background-color 0.25s ${EASE}`,
                  "&:hover": { color: "primary.light", bgcolor: "rgba(161,103,69,0.08)" },
                }}
              >
                {s.icon}
                <Box component="span" sx={{ flex: 1 }}>
                  {s.label}
                </Box>
                {count !== null && (
                  <Typography component="span" variant="caption" color="text.secondary">
                    {count}
                  </Typography>
                )}
                {dirty.has(s.key) && (
                  <Box
                    component="span"
                    role="img"
                    aria-label="Unsaved changes"
                    sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", flexShrink: 0 }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Section content */}
        <Box component="section" aria-label={active.label} sx={{ minWidth: 0 }}>
          <Box mb={3}>
            <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, fontWeight: 700 }}>
              {active.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {active.hint}
            </Typography>
          </Box>
          {renderSection()}
        </Box>
      </Box>

      <Snackbar
        open={!!undo}
        autoHideDuration={6000}
        onClose={(_, reason) => reason !== "clickaway" && setUndo(null)}
        message={undo?.label}
        action={
          <Button
            size="small"
            onClick={() => {
              if (undo) update(() => undo.snapshot);
              setUndo(null);
            }}
          >
            Undo
          </Button>
        }
      />
    </Box>
  );
}
