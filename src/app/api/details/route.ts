import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const baseUrl = process.env.API_BASE_URL;
  const token = process.env.API_BEARER_TOKEN;

  if (!id) {
    return NextResponse.json({ error: "Missing id query param" }, { status: 400 });
  }

  if (!baseUrl || !token) {
    return NextResponse.json(
      { error: "API configuration missing" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${baseUrl}/db_query/coffeecoders_website/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const baseUrl = process.env.API_BASE_URL;
  const token = process.env.API_BEARER_TOKEN;

  console.log("POST Request Received with id:", id); // Debug log

  if (!id) {
    return NextResponse.json({ error: "Missing id query param" }, { status: 400 });
  }

  if (!baseUrl || !token) {
    return NextResponse.json(
      { error: "API configuration missing" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    console.log("POST Body:", body); // Debug log
    console.log("API URL:", `${baseUrl}/db_query/coffeecoders_website/${id}`); // Debug log
    const res = await fetch(`${baseUrl}/db_query/coffeecoders_website/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const baseUrl = process.env.API_BASE_URL;
  const token = process.env.API_BEARER_TOKEN;

  if (!id) {
    return NextResponse.json({ error: "Missing id query param" }, { status: 400 });
  }

  if (!baseUrl || !token) {
    return NextResponse.json(
      { error: "API configuration missing" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const res = await fetch(`${baseUrl}/db_query/coffeecoders_website/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
