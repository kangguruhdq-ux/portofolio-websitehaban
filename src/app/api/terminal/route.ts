import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const revalidate = 60;

export async function GET() {
  try {
    const commands = await prisma.terminalCommand.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, commands });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch terminal commands' }, { status: 500 });
  }
}
