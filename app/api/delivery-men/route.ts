import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const backendBaseUrl = process.env.BACKEND_API_URL;
    if (!backendBaseUrl) {
      throw new Error("READ_BACKEND_URL environment variable is not set");
    }

    const backendUrl = `${backendBaseUrl}/api/deliveryguy`;
    console.log("Fetching from:", backendUrl);

    const backendRes = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const contentType = backendRes.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const errorText = await backendRes.text();
      console.warn("Expected JSON, got:", errorText);
      return NextResponse.json(
        { error: "Invalid response from backend" },
        { status: 502 }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });

  } catch (err) {
    console.error("Error in /api/deliveryguy route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
