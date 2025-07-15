import { NextResponse } from 'next/server';

// ✅ POST: Create a new plan
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // ✅ Validate frontend fields (frontend sends maxBookQuota, planDetails)
    if (
      !data.name ||
      typeof data.monthlyPrice !== "number" ||
      typeof data.yearlyPrice !== "number" ||
      typeof data.maxBookQuota !== "number" ||
      !Array.isArray(data.planDetails)
    ) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    // ✅ Transform data to backend-compatible format
    const transformed = {
      name: data.name,
      monthlyPrice: data.monthlyPrice,
      yearlyPrice: data.yearlyPrice,
      maxQuota: data.maxBookQuota, // rename
      planDescription: data.planDetails.map((item: { value: string }) => item.value), // flatten
    };

    const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8080";
    const backendUrl = `${BACKEND_API_URL}/api/subscription/plan`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformed),
    });

    const responseContentType = response.headers.get("content-type");
    let result;
    if (responseContentType?.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ GET: Fetch all subscription plans
export async function GET() {
  try {
    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';
    const backendUrl = `${BACKEND_API_URL}/api/subscription/plans`;

    const response = await fetch(backendUrl);

    const responseContentType = response.headers.get('content-type');
    let result;
    if (responseContentType?.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}
