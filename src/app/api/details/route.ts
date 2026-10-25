import { NextRequest, NextResponse } from "next/server";
import {
  BackboneError,
  createSiteDetails,
  getSiteDetails,
  saveSiteDetails,
  siteDetailsId,
} from "@/lib/backbone";
import { getAdminSession } from "@/lib/session";
import defaultData from "@/constants/website-details.json";

// The site-details row is fixed server-side (BACKBONE_SITE_DETAILS_ID); clients never pick an id.
// Reads are public; writes require a signed-in admin session.

function unauthorized() {
  return NextResponse.json({ error: "Admin sign-in required" }, { status: 401 });
}

function fail(method: string, error: unknown) {
  console.error(`${method} /api/details:`, error);
  if (error instanceof BackboneError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

export async function GET() {
  try {
    return NextResponse.json(await getSiteDetails());
  } catch (error) {
    return fail("GET", error);
  }
}

/** Seeds the row from the bundled JSON. Only runs when the row does not exist yet. */
export async function POST() {
  if (!(await getAdminSession())) return unauthorized();
  try {
    try {
      await getSiteDetails();
      return NextResponse.json({ error: "Site details already exist" }, { status: 409 });
    } catch (error) {
      if (!(error instanceof BackboneError && error.status === 404)) throw error;
    }

    const id = await createSiteDetails(defaultData);
    if (String(id) !== siteDetailsId()) {
      // Ids are server-assigned; the app will keep reading the configured id until env is updated.
      return NextResponse.json(
        { id, warning: `Created row ${id}; set BACKBONE_SITE_DETAILS_ID=${id}` },
        { status: 201 },
      );
    }
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return fail("POST", error);
  }
}

export async function PUT(request: NextRequest) {
  if (!(await getAdminSession())) return unauthorized();
  try {
    const body = await request.json();
    const doc = body?.pjson;
    if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
      return NextResponse.json({ error: "Body must be { pjson: <object> }" }, { status: 400 });
    }
    await saveSiteDetails(doc);
    return NextResponse.json({ id: siteDetailsId(), pjson: doc });
  } catch (error) {
    return fail("PUT", error);
  }
}
