import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the incoming request.
    const { title  , authorName} = await request.json();
    if (!title) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }

    const backendBaseUrl = process.env.BACKEND_GENAI_API_URL;
    if (!backendBaseUrl) {
      throw new Error('BACKEND_API_URL environment variable is not set');
    }

    // Construct the backend URL for deletion.
    const backendUrl = `${backendBaseUrl}/api/genai/book-description`;

    // Forward the request to the external service.
    const externalResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title , authorName }),
    });

    // If the external service responds with an error, forward the error.
    if (!externalResponse.ok) {
      const errorData = await externalResponse.json();
      return NextResponse.json(
        { message: errorData.message || 'Failed to generate description' },
        { status: externalResponse.status }
      );
    }

    // Parse the response from the external service.
    const data = await externalResponse.json();

    // Return the data back to the client.
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/genai/book-description:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
