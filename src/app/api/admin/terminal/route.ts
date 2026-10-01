import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { terminalCommandSchema } from '@/lib/validators';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const commands = await prisma.terminalCommand.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, commands });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch terminal commands' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = terminalCommandSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid terminal command' },
        { status: 400 }
      );
    }

    const item = await prisma.terminalCommand.create({
      data: {
        ...parsed.data,
        command: parsed.data.command.toLowerCase().trim(),
      },
    });
    return NextResponse.json({ success: true, command: item }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Perintah tersebut sudah terdaftar' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create terminal command' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'Missing command ID' }, { status: 400 });

    const parsed = terminalCommandSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid terminal command' },
        { status: 400 }
      );
    }

    const updated = await prisma.terminalCommand.update({
      where: { id },
      data: {
        ...parsed.data,
        command: parsed.data.command.toLowerCase().trim(),
      },
    });
    return NextResponse.json({ success: true, command: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update terminal command' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing command ID' }, { status: 400 });

    await prisma.terminalCommand.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Command deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete terminal command' }, { status: 500 });
  }
}
