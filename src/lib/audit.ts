import { prisma } from '@/lib/db';

export interface AuditLogInput {
  action: string;
  category: 'VISITOR' | 'AUTH' | 'CRUD' | 'SECURITY' | 'SYSTEM';
  status?: 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'WARNING';
  ip?: string;
  userAgent?: string | null;
  path?: string | null;
  method?: string | null;
  actor?: string | null;
  details?: string | null;
}

/**
 * Extract real client IP from standard HTTP headers
 */
export function extractClientIp(headers: Headers | Record<string, string>): string {
  const getHeader = (name: string): string | null => {
    if (typeof (headers as Headers).get === 'function') {
      return (headers as Headers).get(name);
    }
    const r = headers as Record<string, string>;
    return r[name] || r[name.toLowerCase()] || null;
  };

  const forwardedFor = getHeader('x-forwarded-for');
  if (forwardedFor) {
    // Pick the first IP in the comma-separated chain
    const clientIp = forwardedFor.split(',')[0].trim();
    if (clientIp) return clientIp;
  }

  const realIp = getHeader('x-real-ip');
  if (realIp) return realIp.trim();

  const cfIp = getHeader('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const clientIp = getHeader('x-client-ip');
  if (clientIp) return clientIp.trim();

  return '127.0.0.1';
}

/**
 * Record an audit log event asynchronously into Neon PostgreSQL
 */
export async function recordAuditLog(data: AuditLogInput) {
  try {
    return await prisma.auditLog.create({
      data: {
        action: data.action,
        category: data.category,
        status: data.status || 'SUCCESS',
        ip: data.ip || '127.0.0.1',
        userAgent: data.userAgent || null,
        path: data.path || null,
        method: data.method || 'GET',
        actor: data.actor || 'GUEST',
        details: data.details || null,
      },
    });
  } catch (err) {
    console.error('AuditLog Error:', err);
    return null;
  }
}
