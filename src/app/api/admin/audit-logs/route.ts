import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);
    const page = Math.max(Number(searchParams.get('page')) || 1, 1);
    const skip = (page - 1) * limit;

    // Filter conditions
    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { ip: { contains: q, mode: 'insensitive' } },
        { action: { contains: q, mode: 'insensitive' } },
        { path: { contains: q, mode: 'insensitive' } },
        { actor: { contains: q, mode: 'insensitive' } },
        { details: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Query logs and real database metrics
    const [logs, totalCount, totalVisitors, uniqueIps, securityThreats, adminActions] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.auditLog.count({ where }),
      prisma.auditLog.count({ where: { category: 'VISITOR' } }),
      prisma.auditLog.findMany({
        where: { category: 'VISITOR' },
        select: { ip: true },
        distinct: ['ip'],
      }),
      prisma.auditLog.count({ where: { category: 'SECURITY' } }),
      prisma.auditLog.count({ where: { category: 'CRUD' } }),
    ]);

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        totalVisitors,
        uniqueVisitorIps: uniqueIps.length,
        securityThreatsBlocked: securityThreats,
        adminActionsRecorded: adminActions,
        totalEvents: totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Gagal mengambil data audit log' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const deleteAll = searchParams.get('all') === 'true';
    const id = searchParams.get('id');

    if (deleteAll) {
      const result = await prisma.auditLog.deleteMany({});

      // Record this cleanup action into a fresh audit log
      await recordAuditLog({
        action: 'DELETE_ALL_AUDITS',
        category: 'SYSTEM',
        status: 'WARNING',
        actor: `ADMIN (${session.username || session.userId})`,
        details: `Seluruh audit log (${result.count} rekaman) dihapus permanen oleh admin.`,
      });

      return NextResponse.json({
        success: true,
        message: `Berhasil menghapus seluruh audit log (${result.count} entri).`,
        deletedCount: result.count,
      });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID log diperlukan' }, { status: 400 });
    }

    await prisma.auditLog.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Log audit berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting audit logs:', error);
    return NextResponse.json({ error: 'Gagal menghapus log audit' }, { status: 500 });
  }
}
