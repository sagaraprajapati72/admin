import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Parse query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";

    // Use an environment variable to determine the backend URL
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
      throw new Error("Backend URL is not configured");
    }

    // Forward the GET request to the backend search API
    const res = await fetch(
      `${backendUrl}/api/languages/search?search=${encodeURIComponent(searchQuery)}`
    );

    // If the backend returns an error, capture and return it
    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: errorText || "Failed to fetch Languages" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
