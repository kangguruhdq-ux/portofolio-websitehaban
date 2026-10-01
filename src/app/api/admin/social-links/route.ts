import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { socialLinkSchema } from '@/lib/validators';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, links });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = socialLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid social link payload' },
        { status: 400 }
      );
    }

    const link = await prisma.socialLink.create({ data: parsed.data });
    return NextResponse.json({ success: true, link }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create social link' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const parsed = socialLinkSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 }
      );
    }

    const updated = await prisma.socialLink.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, link: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update social link' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await prisma.socialLink.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Social link deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete social link' }, { status: 500 });
  }
}
