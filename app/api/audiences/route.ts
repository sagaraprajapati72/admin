// app/api/audiences/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {

    // Use an environment variable or fallback URL for your backend author search endpoint
    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';
    const backendUrl = `${BACKEND_API_URL}/api/audiences`;

    const response = await fetch(backendUrl, {
      method: 'GET'
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch audiences' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching audiences from backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    // Parse the incoming form data
    const formData = await request.formData();
    const name = formData.get("name") as string;

    if (!name) {
      return NextResponse.json(
        { error: "Audience name is required" },
        { status: 400 }
      );
    }

    // Construct the payload to send to the backend
    const payload = { name };

    // Use environment variable for backend URL
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
      throw new Error("Backend URL is not configured");
    }

    // Forward the request to the backend API
    const res = await fetch(`${backendUrl}/api/audiences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: errorText || "Failed to create Audience" },
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