import { NextResponse } from 'next/server';
import * as Formidable from 'formidable';
import { readFileSync } from 'fs';
import FormData from 'form-data';
import { IncomingMessage } from 'http';
import { PassThrough } from 'stream';

const { IncomingForm } = Formidable;

/**
 * Converts the Next.js Request into a Node.js IncomingMessage–like stream.
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
 * Parses the multipart/form-data payload using Formidable.
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
 * The POST handler for book creation.
 */
export async function POST(request: Request) {
  try {
    const { fields, files } = await parseForm(request);

    // Validate 'book' field
    let bookContent = fields.book;
    if (Array.isArray(bookContent)) {
      bookContent = bookContent[0];
    }
    if (!bookContent) {
      return NextResponse.json({ error: 'Book field is required' }, { status: 400 });
    }

    // Validate 'images' field
    let imagesFiles = files.images;
    if (!imagesFiles) {
      return NextResponse.json({ error: 'At least one image file is required' }, { status: 400 });
    }
    if (!Array.isArray(imagesFiles)) {
      imagesFiles = [imagesFiles];
    }

    // Prepare FormData for backend
    const formData = new FormData();
    formData.append('book', Buffer.from(bookContent), { contentType: 'application/json' });

    for (const imageFile of imagesFiles) {
      const filePath = imageFile.filepath || imageFile.path;
      if (!filePath) {
        return NextResponse.json({ error: 'File path is undefined for one of the images' }, { status: 400 });
      }

      const originalFilename = imageFile.originalFilename || 'upload.jpg';
      let mimetype = imageFile.mimetype || 'application/octet-stream';

      if (mimetype === 'application/octet-stream') {
        const lower = originalFilename.toLowerCase();
        if (lower.endsWith('.png')) mimetype = 'image/png';
        else if (lower.endsWith('.gif')) mimetype = 'image/gif';
        else mimetype = 'image/jpeg';
      }

      const fileBuffer = readFileSync(filePath);
      formData.append('images', fileBuffer, {
        filename: originalFilename,
        contentType: mimetype,
      });
    }

    const buffer = formData.getBuffer();
    const contentLength = await new Promise<number>((resolve, reject) => {
      formData.getLength((err, length) => {
        if (err) return reject(err);
        resolve(length);
      });
    });

    const backendBaseUrl = process.env.BACKEND_API_URL;
    if (!backendBaseUrl) {
      throw new Error('BACKEND_API_URL environment variable is not set');
    }

    const backendUrl = `${backendBaseUrl}/api/books`;

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
        'Content-Length': contentLength.toString(),
      },
      body: buffer,
    });

    const responseContentType = response.headers.get('content-type');
    let result;
    if (responseContentType?.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    // Forward backend response (even for errors)
    return NextResponse.json(
      typeof result === 'string' ? { error: result } : result,
      { status: response.status }
    );
  } catch (error: any) {
    console.error('Error processing request:', error);

    const message =
      error?.response?.data?.message || // Axios-style
      error?.message ||                // JS Error
      'Internal Server Error';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
