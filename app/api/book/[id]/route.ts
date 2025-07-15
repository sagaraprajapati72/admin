// app/api/book/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const base = process.env.BACKEND_API_URL;
    if (!base) throw new Error('BACKEND_API_URL environment variable is not set');

    const response = await fetch(`${base}/api/books/update/${id}`, { method: 'GET' });
    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err: any) {
    console.error('Error fetching book details:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const base = process.env.BACKEND_API_URL;
    if (!base) throw new Error('BACKEND_API_URL environment variable is not set');

    const body = await request.json();
    const response = await fetch(`${base}/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const ct = response.headers.get('content-type') ?? '';
    const result = ct.includes('application/json') ? await response.json() : await response.text();
    return NextResponse.json(result, { status: response.status });
  } catch (err: any) {
    console.error('Error updating book details:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const base = process.env.BACKEND_API_URL;
    if (!base) throw new Error('BACKEND_API_URL environment variable is not set');

    const response = await fetch(`${base}/api/books/${id}`, { method: 'DELETE' });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const ct = response.headers.get('content-type') ?? '';
    const result = ct.includes('application/json') ? await response.json() : await response.text();
    return NextResponse.json(result, { status: response.status });
  } catch (err: any) {
    console.error('Error processing DELETE request:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
