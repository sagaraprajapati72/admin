// app/api/dispatchBook/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body =await  req.json();
    const { dispatchId} = body ;

    const res = await fetch(`http://192.168.29.110:8080/api/dispatch/loan/${dispatchId}/collect`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      
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
