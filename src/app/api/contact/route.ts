import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactSchema } from '@/lib/validators';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`contact_${ip}`, 3, 60000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak pesan. Silakan tunggu 1 menit.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Input formulir tidak valid' },
        { status: 400 }
      );
    }

    const savedMessage = await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || 'Portfolio Inquiry',
        message: parsed.data.message,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Pesan berhasil terkirim dan disimpan!', id: savedMessage.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in contact endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengirim pesan kontak.' },
      { status: 500 }
    );
  }
}
