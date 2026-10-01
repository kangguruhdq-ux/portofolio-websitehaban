import { NextResponse } from 'next/server';
import { extractClientIp, recordAuditLog } from '@/lib/audit';

// In-memory cache to deduplicate rapid page refreshes from the same IP within 5 minutes
const visitCache = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const ip = extractClientIp(request.headers);
    const userAgent = request.headers.get('user-agent');
    const body = await request.json().catch(() => ({}));
    const path = typeof body.path === 'string' ? body.path : '/';
    const referrer = typeof body.referrer === 'string' ? body.referrer : null;

    // Cache key by IP + path
    const cacheKey = `${ip}:${path}`;
    const now = Date.now();
    const lastVisit = visitCache.get(cacheKey);

    // If visited same path within last 3 minutes, acknowledge without duplicating record
    if (lastVisit && now - lastVisit < 3 * 60 * 1000) {
      return NextResponse.json({ success: true, cached: true, ip });
    }

    visitCache.set(cacheKey, now);

    // Clean up cache periodically
    if (visitCache.size > 5000) {
      visitCache.forEach((time, k) => {
        if (now - time > 10 * 60 * 1000) visitCache.delete(k);
      });
    }

    // Persist real visitor record into Neon PostgreSQL AuditLog
    await recordAuditLog({
      action: 'PAGE_VIEW',
      category: 'VISITOR',
      status: 'SUCCESS',
      ip,
      userAgent,
      path,
      method: 'GET',
      actor: 'GUEST_VISITOR',
      details: JSON.stringify({ referrer }),
    });

    return NextResponse.json({ success: true, ip });
  } catch (error) {
    console.error('Visitor telemetry error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
