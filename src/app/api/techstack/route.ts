import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const revalidate = 60;

export async function GET() {
  try {
    const items = await prisma.techStack.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tech stack' }, { status: 500 });
  }
}
