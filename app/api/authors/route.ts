// app/api/forward/route.ts

import { NextResponse } from 'next/server';
import * as Formidable from 'formidable';
import { readFileSync } from 'fs';
import FormData from 'form-data';
import { IncomingMessage } from 'http';
import { PassThrough } from 'stream';

const { IncomingForm } = Formidable;

/**
 * Converts the Next.js Request (Web API Request) into a Node.js IncomingMessage–like stream.
 */
async function createNodeRequest(req: Request): Promise<IncomingMessage> {
  const buf = Buffer.from(await req.arrayBuffer());
  const stream = new PassThrough();
  stream.end(buf);
  const headers = Object.fromEntries(req.headers.entries());
  const nodeReq = stream as unknown as IncomingMessage;
  (nodeReq as any).headers = headers;
  return nodeReq;
}

/**
 * Parses the multipart/form-data payload using formidable.
 */
async function parseForm(req: Request): Promise<{ fields: any; files: any }> {
  const nodeReq = await createNodeRequest(req);
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(nodeReq, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

/**
 * The POST handler for the API route.
 */
export async function POST(request: Request) {
  try {
    // Parse the incoming multipart/form-data
    const { fields, files } = await parseForm(request);

    // Extract and normalize the "author" field
    let authorContent = fields.author;
    if (Array.isArray(authorContent)) {
      authorContent = authorContent[0];
    }
    if (!authorContent) {
      return NextResponse.json({ error: 'Author field is required' }, { status: 400 });
    }

    // Retrieve the uploaded image file (expected under the key 'image')
    let imageFile = files.image;
    if (!imageFile) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }
    if (Array.isArray(imageFile)) {
      imageFile = imageFile[0];
    }

    // Extract file path (could be under 'filepath' or 'path')
    const filePath = imageFile.filepath || imageFile.path;
    if (!filePath) {
      return NextResponse.json({ error: 'File path is undefined' }, { status: 400 });
    }
    const originalFilename = imageFile.originalFilename || 'upload.jpg';
    let mimetype = imageFile.mimetype || 'application/octet-stream';
    if (mimetype === 'application/octet-stream') {
      const lower = originalFilename.toLowerCase();
      if (lower.endsWith('.png')) {
        mimetype = 'image/png';
      } else if (lower.endsWith('.gif')) {
        mimetype = 'image/gif';
      } else {
        mimetype = 'image/jpeg';
      }
    }

    // Create a new FormData instance for the outgoing request.
    const formData = new FormData();

    // Append the "author" part as a Buffer to ensure it is sent correctly.
    formData.append('author', Buffer.from(authorContent), { contentType: 'application/json' });

    // Append the image file. We read the file into memory since it’s small.
    const fileBuffer = readFileSync(filePath);
    formData.append('image', fileBuffer, {
      filename: originalFilename,
      contentType: mimetype,
    });

    // Get the complete multipart body as a Buffer.
    const buffer = formData.getBuffer();
    // Calculate the content length.
    const contentLength = await new Promise<number>((resolve, reject) => {
      formData.getLength((err, length) => {
        if (err) return reject(err);
        resolve(length);
      });
    });

    // Log the headers and raw body for debugging
   // console.log('Request Headers:', {
     // ...formData.getHeaders(),
      //'Content-Length': contentLength.toString(),
    //});
    //console.log('Raw Request Body:\n', buffer.toString());

    // Forward the request to the backend.
    // Use an environment variable or fallback URL for your backend author search endpoint
    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';
    const backendUrl = `${BACKEND_API_URL}/api/authors`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
        'Content-Length': contentLength.toString(),
      },
      body: buffer,
    });

    // Handle the backend response.
    const responseContentType = response.headers.get('content-type');
    let result;
    if (responseContentType && responseContentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }
    
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function GET(request: Request) {
  try {
    // Parse the incoming request URL to extract query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Use an environment variable or fallback URL for your backend author search endpoint
    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';
    const backendUrl = `${BACKEND_API_URL}/api/authors`;

    const url = new URL(backendUrl);
    // Forward the "search" query parameter to the backend
    url.searchParams.append("search", search);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch authors' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error processing request:', error);

    const message =
      error?.response?.data?.message || // Axios-style
      error?.message ||                // JS Error
      'Internal Server Error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}