import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Use environment variable or default to localhost
    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';
    const backendUrl = `${BACKEND_API_URL}/api/languages`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch languages' }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    // Parse the incoming form data
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;


    if (!name || !code) {
      return NextResponse.json(
        { error: "Language name & code is required" },
        { status: 400 }
      );
    }

    // Construct the payload to send to the backend
    const payload = { name  , code};

    // Use environment variable for backend URL
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
      throw new Error("Backend URL is not configured");
    }

    // Forward the request to the backend API
    const res = await fetch(`${backendUrl}/api/languages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: errorText || "Failed to create Language" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}