import { promises } from "dns";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
   context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Use environment variable for the backend URL
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
      throw new Error("Backend URL is not configured");
    }

    // Forward the DELETE request to the backend API
    const response = await fetch(`${backendUrl}/api/genres/${id}`, {
      method: "DELETE",
    });

     // If the backend returns a 204 (No Content), return a response with no body.
     if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
      }
  
      // Process the backend response.
      const responseContentType = response.headers.get('content-type');
      let result;
      if (responseContentType && responseContentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text();
      }
  
      return NextResponse.json(result, { status: response.status });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
