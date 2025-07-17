import { NextRequest, NextResponse } from "next/server";

// ✅ Create FAQ (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.question || !body.answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    const backendBaseUrl = process.env.BACKEND_API_URL;
    if (!backendBaseUrl) {
      throw new Error("Backend URL is not configured");
    }

    const backendRes = await fetch(`${backendBaseUrl}/api/faqs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseData = await backendRes.json();
    return NextResponse.json(responseData, { status: backendRes.status });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Get All FAQs (GET)
export async function GET() {
  try {
    const backendBaseUrl = process.env.BACKEND_API_URL;
    if (!backendBaseUrl) {
      throw new Error("Backend URL is not configured");
    }

    const backendRes = await fetch(`${backendBaseUrl}/api/faqs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const faqs = await backendRes.json();
    return NextResponse.json(faqs, { status: backendRes.status });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
