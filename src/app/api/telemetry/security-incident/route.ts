import { NextResponse } from 'next/server';
import { recordAuditLog } from '@/lib/audit';

export async function POST(request: Request) {
  try {
    const internalHeader = request.headers.get('x-internal-waf-token');
    if (internalHeader !== 'INTERNAL_SHIELD_DISPATCH') {
      return NextResponse.json({ error: 'Unauthorized internal call' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { ip, userAgent, path, threatType } = body;

    await recordAuditLog({
      action: `ATTACK_BLOCKED_${threatType || 'CYBER_THREAT'}`,
      category: 'SECURITY',
      status: 'BLOCKED',
      ip: ip || 'UNKNOWN',
      userAgent: userAgent || 'UNKNOWN',
      path: path || '/',
      method: 'PROBE',
      actor: 'MALICIOUS_THREAT_ACTOR',
      details: JSON.stringify({
        threatType,
        interceptedAt: new Date().toISOString(),
        defenseAction: 'WAF_SENTINEL_DROP',
      }),
    });

    return NextResponse.json({ success: true, recorded: true });
  } catch (error) {
    console.error('Failed to log security incident:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
