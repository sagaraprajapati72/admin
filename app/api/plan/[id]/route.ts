// app/api/plan/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const base = process.env.BACKEND_API_URL;
    if (!base) throw new Error('BACKEND_API_URL environment variable is not set');

    const res = await fetch(`${base}/api/subscription/plans/${id}`, { method: 'GET' });
    const ct = res.headers.get('content-type') || '';
    const result = ct.includes('application/json') ? await res.json() : await res.text();

    return NextResponse.json(result, { status: res.status });
  } catch (err: any) {
    console.error('GET Error:', err);
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
    const res = await fetch(`${base}/api/subscription/plan/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const ct = res.headers.get('content-type') || '';
    const result = ct.includes('application/json') ? await res.json() : await res.text();

    return NextResponse.json(result, { status: res.status });
  } catch (err: any) {
    console.error('PUT Error:', err);
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

    const res = await fetch(`${base}/api/subscription/plan/${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    const ct = res.headers.get('content-type') || '';
    const result = ct.includes('application/json') ? await res.json() : await res.text();

    return NextResponse.json(result, { status: res.status });
  } catch (err: any) {
    console.error('DELETE Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
