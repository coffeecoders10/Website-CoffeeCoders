// Server-side client for the Backbone `db_query` API (docs/backend-arch-docs/sop-db-query.md).
// Never import this from a client component: it reads secrets from the environment.

export class BackboneError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function config() {
  const baseUrl = process.env.BACKBONE_URL;
  const apiKey = process.env.BACKBONE_DB_QUERY_API_KEY;
  const table = process.env.BACKBONE_SITE_TABLE;
  if (!baseUrl || !apiKey || !table) {
    throw new BackboneError("Backbone configuration missing", 500);
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey, table };
}

export interface BackboneUser {
  id: number;
  user_id: string;
  username: string;
  full_name: string;
}

/** Verifies credentials via /auth/login (public endpoint: no API key). Throws BackboneError(401) if invalid. */
export async function loginUser(username: string, password: string): Promise<BackboneUser> {
  const { baseUrl } = config();
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new BackboneError(data?.error ?? `Login failed (${res.status})`, res.status);
  }
  return data.user as BackboneUser;
}

/** Row id of the site-details document. Server-assigned, so it lives in env. */
export function siteDetailsId(): string {
  return process.env.BACKBONE_SITE_DETAILS_ID || "1";
}

async function request<T>(path: string, init: { method: string; body?: unknown }): Promise<T> {
  const { baseUrl, apiKey, table } = config();
  const res = await fetch(`${baseUrl}/db_query/${table}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new BackboneError(data?.error ?? `Backbone request failed (${res.status})`, res.status);
  }
  return data as T;
}

/** Reads the document. Throws BackboneError(404) if the row does not exist. */
export async function getSiteDetails<T = unknown>(): Promise<{ id: number; pjson: T }> {
  return request(`/${siteDetailsId()}`, { method: "GET" });
}

/** Replaces the whole document. Always wraps in `pjson` (omitting it corrupts the row). */
export async function saveSiteDetails(doc: unknown): Promise<void> {
  await request(`/${siteDetailsId()}`, { method: "PUT", body: { pjson: doc } });
}

/** Creates a new row and writes `doc` into it. Returns the server-assigned id. */
export async function createSiteDetails(doc: unknown): Promise<number> {
  const created = await request<{ project_id: number }>("", {
    method: "POST",
    body: { name: "coffeecoders_website", description: "CoffeeCoders site details" },
  });
  await request(`/${created.project_id}`, { method: "PUT", body: { pjson: doc } });
  return created.project_id;
}
