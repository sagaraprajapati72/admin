import { NextRequest, NextResponse } from "next/server";

// ✅ PUT: Update FAQ by ID
export async function PUT(
  request: Request,
   context : { params: Promise< { id: string } >}
) {
   const { id } = await context.params;

  try {
    const body = await request.json();

    if (!body.question || !body.answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    const backendBaseUrl = process.env.BACKEND_API_URL;
    if (!backendBaseUrl) throw new Error("Backend URL is not configured");

    const backendRes = await fetch(`${backendBaseUrl}/api/faqs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseData = await backendRes.json();
    return NextResponse.json(responseData, { status: backendRes.status });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ DELETE: Delete FAQ by ID
export async function DELETE(
  request: Request,
 context : { params: Promise< { id: string } >}
) {
 const { id } = await context.params;

  try {
    const backendBaseUrl = process.env.BACKEND_API_URL;
    if (!backendBaseUrl) throw new Error("Backend URL is not configured");

    const backendRes = await fetch(`${backendBaseUrl}/api/faqs/${id}`, {
      method: "DELETE",
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return NextResponse.json({ error: errorText }, { status: backendRes.status });
    }

    return NextResponse.json(
      { message: "FAQ deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ OPTIONAL: GET a single FAQ by ID

