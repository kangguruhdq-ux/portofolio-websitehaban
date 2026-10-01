import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { visitorLogSchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const logs = await prisma.visitorLog.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching visitor logs:', error);
    return NextResponse.json({ success: false, error: 'Database query failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`comment_${ip}`, 5, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak permintaan. Harap tunggu 1 menit.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = visitorLogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const newLog = await prisma.visitorLog.create({
      data: {
        author: parsed.data.author,
        role: parsed.data.role,
        message: parsed.data.message,
        isApproved: true,
      },
    });

    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (error) {
    console.error('Error saving visitor log:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mencatat log ke database' },
      { status: 500 }
    );
  }
}
