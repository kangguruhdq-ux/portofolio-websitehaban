import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { navigationSchema } from '@/lib/validators';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const navItems = await prisma.navigation.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, navItems });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch navigation items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = navigationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid navigation payload' },
        { status: 400 }
      );
    }

    const item = await prisma.navigation.create({ data: parsed.data });
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create navigation item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const parsed = navigationSchema.partial().safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid payload' },
        { status: 400 }
      );
    }

    const updated = await prisma.navigation.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error updating navigation item:', error);
    return NextResponse.json({ error: 'Failed to update navigation item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await prisma.navigation.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Navigation item deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 });
  }
}
