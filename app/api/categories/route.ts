


import { NextResponse } from 'next/server';
import * as Formidable from 'formidable';
import { readFileSync } from 'fs';
import FormData from 'form-data';
import { IncomingMessage } from 'http';
import { PassThrough } from 'stream';

const { IncomingForm } = Formidable;


async function createNodeRequest(req: Request): Promise<IncomingMessage> {
    const buf = Buffer.from(await req.arrayBuffer());
    const stream = new PassThrough();
    stream.end(buf);
    const headers = Object.fromEntries(req.headers.entries());
    const nodeReq = stream as unknown as IncomingMessage;
    (nodeReq as any).headers = headers;
    return nodeReq;
}


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
export async function POST(request: Request) {
    try {
        // Parse the incoming multipart/form-data request
        const { fields, files } = await parseForm(request);

        let categoryContent = fields.category;
        if (Array.isArray(categoryContent)) {
            categoryContent = categoryContent[0];
        }
        if (!categoryContent) {
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
        formData.append('category', Buffer.from(categoryContent), { contentType: 'application/json' });

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

        // Forward the request to the backend book creation endpoint.
        const backendBaseUrl = process.env.BACKEND_API_URL;
        if (!backendBaseUrl) {
            throw new Error('BACKEND_API_URL environment variable is not set');
        }

        const backendUrl = `${backendBaseUrl}/api/categories`;

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                ...formData.getHeaders(),
                'Content-Length': contentLength.toString(),
            },
            body: buffer,
        });

        // Process the backend response.
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
    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';
    const backendUrl = `${BACKEND_API_URL}/api/categories`;

    const response = await fetch(backendUrl, { method: 'GET' });
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch audiences' }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching audiences from backend:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}