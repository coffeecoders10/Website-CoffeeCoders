import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.json({ user: { username: session.username } });
}
