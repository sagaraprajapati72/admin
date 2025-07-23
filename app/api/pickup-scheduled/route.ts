import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {

    const backendBaseUrl = process.env.BACKEND_API_URL;
    if (!backendBaseUrl) {
      throw new Error("READ_BACKEND_URL environment variable is not set");
    }

    const backendUrl = `${backendBaseUrl}/api/loans/pickup-scheduled`;

    const backendRes = await fetch(backendUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const text = await backendRes.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        console.warn("Invalid JSON from backend:", text);
      }
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error("Error in /api/loans route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
