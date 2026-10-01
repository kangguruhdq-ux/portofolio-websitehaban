import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const logs = await prisma.visitorLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching admin visitor logs:', error);
    return NextResponse.json({ success: false, error: 'Database query failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, role, message, isApproved } = body;

    if (!author?.trim() || !message?.trim()) {
      return NextResponse.json({ success: false, error: 'Nama dan pesan wajib diisi' }, { status: 400 });
    }

    const newLog = await prisma.visitorLog.create({
      data: {
        author: author.trim(),
        role: role || 'VISITOR',
        message: message.trim(),
        isApproved: isApproved !== undefined ? Boolean(isApproved) : true,
      },
    });

    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (error) {
    console.error('Error creating visitor log:', error);
    return NextResponse.json({ success: false, error: 'Gagal membuat log baru' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, author, role, message, isApproved } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak valid' }, { status: 400 });
    }

    const updated = await prisma.visitorLog.update({
      where: { id },
      data: {
        ...(author ? { author: author.trim() } : {}),
        ...(role ? { role } : {}),
        ...(message ? { message: message.trim() } : {}),
        ...(isApproved !== undefined ? { isApproved: Boolean(isApproved) } : {}),
      },
    });

    return NextResponse.json({ success: true, log: updated });
  } catch (error) {
    console.error('Error updating visitor log:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengupdate log' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID tidak ditemukan' }, { status: 400 });
    }

    await prisma.visitorLog.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Log berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting visitor log:', error);
    return NextResponse.json({ success: false, error: 'Gagal menghapus log' }, { status: 500 });
  }
}
