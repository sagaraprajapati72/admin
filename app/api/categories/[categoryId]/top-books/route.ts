import { NextResponse } from 'next/server';

export async function GET(request: Request, context : {  params: Promise<{ categoryId: string }> }) {
  try {
    const { categoryId } = await context.params
    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';
    const backendUrl = `${BACKEND_API_URL}/api/categories/${categoryId}/top-books`;

    const response = await fetch(backendUrl, { method: 'GET' });
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch top books' }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching top books from backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}