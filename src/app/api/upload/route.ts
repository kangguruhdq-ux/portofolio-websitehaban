import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'application/pdf',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const alt = (formData.get('alt') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not supported: ${file.type}. Allowed: JPEG, PNG, WEBP, SVG, GIF, PDF.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas maksimal 4.5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl = '';
    const base64Data = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64Data}`;

    // On Vercel / serverless runtimes, filesystem is read-only and ephemeral.
    // Storing data URI in PostgreSQL guarantees 100% persistence without 404 or EROFS errors.
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      publicUrl = dataUri;
    } else {
      try {
        const ext = path.extname(file.name).toLowerCase() || '.jpg';
        const randomName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, randomName);
        await writeFile(filePath, buffer);
        publicUrl = `/uploads/${randomName}`;
      } catch {
        publicUrl = dataUri;
      }
    }

    const mediaRecord = await prisma.media.create({
      data: {
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        url: publicUrl,
        alt: alt || file.name,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      media: mediaRecord,
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to process file upload' }, { status: 500 });
  }
}
