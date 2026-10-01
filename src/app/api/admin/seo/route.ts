import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { seoSchema } from '@/lib/validators';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const seo = await prisma.seoSetting.findUnique({
      where: { id: 'seo_default' },
    });
    return NextResponse.json({ success: true, seo });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = seoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid SEO payload' },
        { status: 400 }
      );
    }

    const updated = await prisma.seoSetting.upsert({
      where: { id: 'seo_default' },
      update: parsed.data,
      create: {
        id: 'seo_default',
        ...parsed.data,
      },
    });

    return NextResponse.json({ success: true, seo: updated });
  } catch (error) {
    console.error('Error updating SEO:', error);
    return NextResponse.json({ error: 'Failed to update SEO' }, { status: 500 });
  }
}
