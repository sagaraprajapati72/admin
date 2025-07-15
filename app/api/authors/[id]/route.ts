import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const base = process.env.BACKEND_API_URL;
    if (!base) throw new Error('BACKEND_API_URL not set');
    const res = await fetch(`${base}/api/authors/${id}`);
    const ct = res.headers.get('content-type') || '';
    const data = ct.includes('application/json') ? await res.json() : await res.text();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error('GET error:', e);
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
    if (!base) throw new Error('BACKEND_API_URL not set');
    const body = await request.json();
    const res = await fetch(`${base}/api/authors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const ct = res.headers.get('content-type') || '';
    const data = ct.includes('application/json') ? await res.json() : await res.text();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error('PUT error:', e);
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
    if (!base) throw new Error('BACKEND_API_URL not set');
    const res = await fetch(`${base}/api/authors/${id}`, { method: 'DELETE' });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const ct = res.headers.get('content-type') || '';
    const data = ct.includes('application/json') ? await res.json() : await res.text();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error('DELETE error:', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
