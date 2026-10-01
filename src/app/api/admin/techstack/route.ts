import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { techStackSchema } from '@/lib/validators';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const items = await prisma.techStack.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tech stack' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = techStackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid tech stack payload' },
        { status: 400 }
      );
    }

    const item = await prisma.techStack.create({ data: parsed.data });
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error('Error creating tech stack:', error);
    return NextResponse.json({ error: 'Failed to create tech stack' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'Missing tech stack ID' }, { status: 400 });

    const parsed = techStackSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid tech stack payload' },
        { status: 400 }
      );
    }

    const updated = await prisma.techStack.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tech stack' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing tech stack ID' }, { status: 400 });

    await prisma.techStack.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Tech stack deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete tech stack' }, { status: 500 });
  }
}
