import { NextRequest, NextResponse } from "next/server";
import { BackboneError, loginUser } from "@/lib/backbone";
import {
  SESSION_COOKIE,
  createSessionToken,
  isAllowedAdmin,
  sessionCookieOptions,
} from "@/lib/session";

// Backbone has no rate limiting, so throttle failed attempts per IP here (in-memory, per instance).
const MAX_FAILURES = 5;
const WINDOW_MS = 10 * 60 * 1000;
const failures = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

function isLimited(ip: string): boolean {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (entry.resetAt < Date.now()) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function recordFailure(ip: string) {
  const entry = failures.get(ip);
  if (!entry || entry.resetAt < Date.now()) {
    failures.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (isLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const username = body?.username;
  const password = body?.password;
  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  try {
    const user = await loginUser(username, password);

    if (!isAllowedAdmin(user.username)) {
      recordFailure(ip);
      return NextResponse.json({ error: "This account is not an admin." }, { status: 403 });
    }

    const res = NextResponse.json({ user: { username: user.username, full_name: user.full_name } });
    res.cookies.set(SESSION_COOKIE, createSessionToken(user.username, user.user_id), sessionCookieOptions);
    return res;
  } catch (error) {
    if (error instanceof BackboneError && error.status === 401) {
      recordFailure(ip);
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }
    console.error("POST /api/admin/login:", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
