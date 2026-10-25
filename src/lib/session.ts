import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Backbone's /auth/login only verifies credentials (no token/session), so we issue our own
// signed, httpOnly cookie after a successful login by an allow-listed admin.

export const SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export interface AdminSession {
  username: string;
  userId: string;
  exp: number;
}

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("ADMIN_SESSION_SECRET missing or too short");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function allowedAdmins(): string[] {
  return (process.env.ADMIN_USERNAMES ?? "")
    .split(",")
    .map((u) => u.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(username: string): boolean {
  return allowedAdmins().includes(username.toLowerCase());
}

export function createSessionToken(username: string, userId: string): string {
  const session: AdminSession = {
    username,
    userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string): AdminSession | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminSession;
    if (session.exp < Math.floor(Date.now() / 1000)) return null;
    // Re-check the allowlist so removing an admin from env revokes live sessions.
    return isAllowedAdmin(session.username) ? session : null;
  } catch {
    return null;
  }
}

/** The signed-in admin, or null. Use in route handlers. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
