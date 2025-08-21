import { NextResponse } from 'next/server';
import * as Formidable from 'formidable';
import { readFileSync } from 'fs';
import FormData from 'form-data';
import { IncomingMessage } from 'http';
import { PassThrough } from 'stream';

const { IncomingForm } = Formidable;

// Convert Next.js Request into Node IncomingMessage
async function createNodeRequest(req: Request): Promise<IncomingMessage> {
  const buf = Buffer.from(await req.arrayBuffer());
  const stream = new PassThrough();
  stream.end(buf);
  const headers = Object.fromEntries(req.headers.entries());
  const nodeReq = stream as unknown as IncomingMessage;
  (nodeReq as any).headers = headers;
  return nodeReq;
}

// Parse multipart form data using formidable
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

// ✅ POST handler (your existing code)
export async function POST(request: Request) {
  try {
    const { fields, files } = await parseForm(request);

    let categoryContent = fields.category;
    if (Array.isArray(categoryContent)) {
      categoryContent = categoryContent[0];
    }
    if (!categoryContent) {
      return NextResponse.json({ error: 'Category field is required' }, { status: 400 });
    }

    const categoryJson =
      typeof categoryContent === 'string'
        ? categoryContent
        : JSON.stringify(categoryContent);

    const formData = new FormData();
    formData.append('category', Buffer.from(categoryJson), {
      contentType: 'application/json',
    });

    const appendFile = (fileObj: any, key: string) => {
      if (!fileObj) return;
      if (Array.isArray(fileObj)) fileObj = fileObj[0];
      const filePath = fileObj.filepath || fileObj.path;
      if (!filePath) return;

      const filename = fileObj.originalFilename || 'upload.jpg';
      let mimetype = fileObj.mimetype || 'application/octet-stream';

      if (mimetype === 'application/octet-stream') {
        const lower = filename.toLowerCase();
        if (lower.endsWith('.png')) mimetype = 'image/png';
        else if (lower.endsWith('.gif')) mimetype = 'image/gif';
        else mimetype = 'image/jpeg';
      }

      const fileBuffer = readFileSync(filePath);
      formData.append(key, fileBuffer, { filename, contentType: mimetype });
    };

    appendFile(files.image, 'image');
    appendFile(files.icon, 'icon');

    const buffer = formData.getBuffer();
    const contentLength: number = await new Promise((resolve, reject) => {
      formData.getLength((err, length) => {
        if (err) return reject(err);
        resolve(length);
      });
    });

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

    const responseContentType = response.headers.get('content-type');
    const result =
      responseContentType?.includes('application/json')
        ? await response.json()
        : await response.text();

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ✅ GET handler (new)
export async function GET() {
  try {
    const backendBaseUrl = process.env.BACKEND_API_URL;
    if (!backendBaseUrl) {
      throw new Error('BACKEND_API_URL environment variable is not set');
    }
    const backendUrl = `${backendBaseUrl}/api/categories`;

    const response = await fetch(backendUrl, { method: 'GET' });
    const responseContentType = response.headers.get('content-type');

    const result =
      responseContentType?.includes('application/json')
        ? await response.json()
        : await response.text();

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
