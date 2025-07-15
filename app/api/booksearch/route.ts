import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Define backend URL (can be set via an environment variable)

    // Forward the request to the backend book creation endpoint.
    const backendBaseUrl  = process.env.BACKEND_BOOKSEARCH_URL;
    if (!backendBaseUrl ) {
      throw new Error('BACKEND_BOOKSEARCH_URL environment variable is not set');
    }

    const backendUrl = `${backendBaseUrl}/search`;

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // Append the query parameter to the backend URL
    const backendRequestUrl = `${backendUrl}?q=${encodeURIComponent(query)}`;

    const response = await fetch(backendRequestUrl, { method: "GET" });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch search results" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching search results from backend:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
