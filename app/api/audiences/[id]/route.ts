import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;  // 🟢 Await here

  try {
    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) throw new Error('Backend URL is not configured');

    const response = await fetch(`${backendUrl}/api/audiences/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const contentType = response.headers.get('content-type') ?? '';
    const result = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    return NextResponse.json(result, { status: response.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
