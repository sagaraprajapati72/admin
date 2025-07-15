import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the incoming request.
    const { title, authorName, summary } = await request.json();
    if (!title || !authorName || !summary) {
      return NextResponse.json(
        { message: "Title, authorName, and summary are required." },
        { status: 400 }
      );
    }

    const backendBaseUrl = process.env.BACKEND_GENAI_API_URL;
    if (!backendBaseUrl) {
      throw new Error('BACKEND_API_URL environment variable is not set');
    }

    // Construct the backend URL for deletion.
    const backendUrl = `${backendBaseUrl}/api/genai/book-keywords`;


    // Forward the request to the external service.
    const externalResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, authorName, summary }),
    });

    // If the external service responds with an error, forward that error.
    if (!externalResponse.ok) {
      const errorData = await externalResponse.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to generate keywords." },
        { status: externalResponse.status }
      );
    }

    // Parse the response from the external service.
    const data = await externalResponse.json();

    // Return the generated keywords data back to the client.
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/genai/search-keyword:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
