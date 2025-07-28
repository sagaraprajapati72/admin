// app/api/dispatchBook/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body =await  req.json();
    const { dispatchId, deliveryGuyId} = body ;
const backendBaseUrl  = process.env.BACKEND_API_URL;
    const res = await fetch(`${backendBaseUrl}/api/dispatch/loan/${dispatchId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deliveryGuyId }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Failed to dispatch" }, { status: res.status });
    }

    return NextResponse.json({ message: "Dispatched successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
