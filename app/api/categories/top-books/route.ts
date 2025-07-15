import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';
    const backendUrl = `${BACKEND_API_URL}/api/categories/top-books`;

    // Expecting body: { categoryId: number, bookIds: Array<number> }
    const body = await request.json();
    const payload = {
      categoryId: Number(body.categoryId),
      bookIds: Array.isArray(body.bookIds) ? body.bookIds : [],
    };

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch (parseError) {
      console.warn('Failed to parse JSON from backend response:', parseError);
    }

    if (!response.ok) {
      return NextResponse.json({ error: data?.message || text || 'Request failed' }, { status: response.status });
    }

    return NextResponse.json(data ?? {}, { status: response.status });
  } catch (error) {
    console.error('Error saving top books to backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
