import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { inspectStringForThreats, inspectUserAgent } from '@/lib/security';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'c8e6f1a9b2d4e8a7c3b9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1'
);

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const fullTarget = pathname + search;

  // Extract client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientIp = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      '127.0.0.1';

  const userAgent = request.headers.get('user-agent');

  // Skip WAF & auth checks for telemetry ingestion endpoints
  if (pathname.startsWith('/api/telemetry')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-real-client-ip', clientIp);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Helper to persist blocked attack event in AuditLog asynchronously
  const reportIncident = (threatType?: string) => {
    try {
      fetch(`${request.nextUrl.origin}/api/telemetry/security-incident`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-waf-token': 'INTERNAL_SHIELD_DISPATCH',
        },
        body: JSON.stringify({
          ip: clientIp,
          userAgent: userAgent || 'UNKNOWN',
          path: pathname + search,
          threatType: threatType || 'CYBER_THREAT',
        }),
      }).catch(() => {});
    } catch {
      // Silently ignore async logging failure
    }
  };

  // --- 1. WAF CYBER DEFENSE SHIELD: DETECT AND BLOCK MALICIOUS PROBES ---
  const uaThreat = inspectUserAgent(userAgent);
  if (uaThreat.isThreat) {
    reportIncident(uaThreat.threatType || 'MALICIOUS_SCANNER');
    return new NextResponse(
      JSON.stringify({
        error: 'Forbidden: Malicious Vulnerability Scanner Blocked by Astra WAF Sentinel',
        status: 403,
        threat: uaThreat.threatType || 'MALICIOUS_SCANNER',
        ip: clientIp,
      }),
      { status: 403, headers: { 'Content-Type': 'application/json', 'X-Cyber-Defense': 'BLOCKED' } }
    );
  }

  // Full URL threat inspection (supporting both %20 and + space encodings)
  const rawTarget = request.url;
  let decodedTarget = rawTarget;
  try {
    decodedTarget = decodeURIComponent(rawTarget.replace(/\+/g, ' '));
  } catch {
    decodedTarget = rawTarget;
  }

  const urlThreat = inspectStringForThreats(decodedTarget);
  if (urlThreat.isThreat) {
    reportIncident(urlThreat.threatType || 'ATTACK_VECTOR');
    return new NextResponse(
      JSON.stringify({
        error: 'Forbidden: Cyber Threat Attack Vector Blocked by Astra WAF Sentinel',
        status: 403,
        threat: urlThreat.threatType || 'ATTACK_VECTOR',
        ip: clientIp,
      }),
      { status: 403, headers: { 'Content-Type': 'application/json', 'X-Cyber-Defense': 'BLOCKED' } }
    );
  }

  // --- 2. ADMIN AUTHENTICATION GUARD (/admin & /api/admin) ---
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPage || isAdminApi) {
    const isLoginPage = pathname === '/admin/login';
    const token = request.cookies.get('mahabbah_admin_session')?.value;

    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // Admin API route security check
    if (isAdminApi && !isAuthenticated) {
      return NextResponse.json(
        {
          error: 'Unauthorized: Clearance Level 01 Required. Session token missing or expired.',
          code: 'UNAUTHORIZED_ACCESS_BLOCKED',
          ip: clientIp,
        },
        { status: 401 }
      );
    }

    // Admin UI pages check
    if (isAdminPage) {
      if (isLoginPage && isAuthenticated) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      if (!isLoginPage && !isAuthenticated) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Pass extracted client IP downstream in request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-real-client-ip', clientIp);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
