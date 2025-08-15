


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

        // Parse category JSON
        let categoryContent = fields.category;
        if (Array.isArray(categoryContent)) categoryContent = categoryContent[0];
        if (!categoryContent) {
            return NextResponse.json({ error: 'Category field is required' }, { status: 400 });
        }

        const categoryJson = typeof categoryContent === 'string'
            ? categoryContent
            : JSON.stringify(categoryContent);

        // Create FormData to send to backend
        const formData = new FormData();
        formData.append('category', new Blob([categoryJson], { type: 'application/json' }));

        // Helper to process file
        const appendFile = (fileObj: any, key: string) => {
            if (!fileObj) return;
            if (Array.isArray(fileObj)) fileObj = fileObj[0];
            const filePath = fileObj.filepath || fileObj.path;
            if (!filePath) return;

            const filename = fileObj.originalFilename || 'upload.jpg';
            let mimetype = fileObj.mimetype || 'application/octet-stream';

            // Guess mimetype if unknown
            if (mimetype === 'application/octet-stream') {
                const lower = filename.toLowerCase();
                if (lower.endsWith('.png')) mimetype = 'image/png';
                else if (lower.endsWith('.gif')) mimetype = 'image/gif';
                else mimetype = 'image/jpeg';
            }

            const fileBuffer = readFileSync(filePath);
            formData.append(key, new Blob([fileBuffer], { type: mimetype }), filename);
        };

        // Append both image & icon if provided
        appendFile(files.image, 'image');
        appendFile(files.icon, 'icon');

        // Send to backend
        const backendBaseUrl = process.env.BACKEND_API_URL;
        if (!backendBaseUrl) {
            throw new Error('BACKEND_API_URL environment variable is not set');
        }

        const backendUrl = `${backendBaseUrl}/api/categories`;
        const response = await fetch(backendUrl, {
            method: 'POST',
            body: formData as any, // TS may still require `as any`
        });

        const responseContentType = response.headers.get('content-type');
        const result = responseContentType?.includes('application/json')
            ? await response.json()
            : await response.text();

        return NextResponse.json(result, { status: response.status });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
