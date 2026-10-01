/**
 * Cyber Security Hardening & Threat Detection Engine
 * Protects against SQL Injection, XSS, Path Traversal, Command Injection, and Automated Scanners.
 */

export interface SecurityInspectionResult {
  isThreat: boolean;
  threatType?: 'SQL_INJECTION' | 'XSS' | 'PATH_TRAVERSAL' | 'COMMAND_INJECTION' | 'MALICIOUS_SCANNER';
  payload?: string;
  description?: string;
}

// Threat pattern signatures
const SQLI_PATTERNS = [
  /\b(union\s+select)\b/i,
  /\b(select\s+.*\s+from)\b/i,
  /\b(insert\s+into\s+.*\s+values)\b/i,
  /\b(drop\s+table|truncate\s+table)\b/i,
  /\b(information_schema|sys\.tables|pg_catalog)\b/i,
  /\b(waitfor\s+delay|sleep\(\s*\d+\s*\)|benchmark\(\s*\d+\s*,)\b/i,
  /'\s*(or|and)\s*['"]?\d+['"]?\s*=\s*['"]?\d+/i,
  /--\s*$/m,
  /\/\*.*?\*\//,
];

const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
  /javascript\s*:/i,
  /\bon(?:error|load|click|mouseover|submit|focus|blur)\s*=/i,
  /alert\s*\(\s*['"`]?/i,
  /<iframe\b|<object\b|<embed\b|<applet\b/i,
  /document\s*\.\s*(?:cookie|location|domain)/i,
];

const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\/|\.\.\\/i,
  /(?:%2e%2e%2f|%2e%2e\/|\.\.%2f|%2e%2e%5c)/i,
  /\/etc\/passwd|\/etc\/shadow|c:\\windows|c:\/windows|win\.ini/i,
];

const CMD_INJECTION_PATTERNS = [
  /[;|&`]\s*(?:cat|ls|rm|wget|curl|bash|sh|powershell|cmd\.exe|nc|netcat)\b/i,
  /\$\(\s*(?:whoami|id|uname|cat|curl)\b/i,
];

const MALICIOUS_SCANNERS = [
  /sqlmap/i,
  /nikto/i,
  /acunetix/i,
  /dirbuster/i,
  /gobuster/i,
  /wpscan/i,
  /nmap\s*scripting\s*engine/i,
  /masscan/i,
  /zgrab/i,
];

/**
 * Inspect a raw string payload for cyber security threats
 */
export function inspectStringForThreats(input: string): SecurityInspectionResult {
  if (!input || typeof input !== 'string') return { isThreat: false };

  // 1. SQL Injection
  for (const pattern of SQLI_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isThreat: true,
        threatType: 'SQL_INJECTION',
        payload: input.substring(0, 150),
        description: 'Deteksi payload SQL Injection dalam permintaan HTTP.',
      };
    }
  }

  // 2. XSS (Cross-Site Scripting)
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isThreat: true,
        threatType: 'XSS',
        payload: input.substring(0, 150),
        description: 'Deteksi serangan Cross-Site Scripting (XSS).',
      };
    }
  }

  // 3. Path Traversal
  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isThreat: true,
        threatType: 'PATH_TRAVERSAL',
        payload: input.substring(0, 150),
        description: 'Deteksi upaya Directory / Path Traversal.',
      };
    }
  }

  // 4. Command Injection
  for (const pattern of CMD_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isThreat: true,
        threatType: 'COMMAND_INJECTION',
        payload: input.substring(0, 150),
        description: 'Deteksi upaya Remote Command Execution / Injection.',
      };
    }
  }

  return { isThreat: false };
}

/**
 * Inspect User-Agent for known aggressive vulnerability scanners
 */
export function inspectUserAgent(ua: string | null): SecurityInspectionResult {
  if (!ua) return { isThreat: false };
  for (const scanner of MALICIOUS_SCANNERS) {
    if (scanner.test(ua)) {
      return {
        isThreat: true,
        threatType: 'MALICIOUS_SCANNER',
        payload: ua,
        description: `Automated vulnerability scanner terdeteksi: ${ua}`,
      };
    }
  }
  return { isThreat: false };
}

// In-memory rate limiting & brute force tracker
interface RateLimitRecord {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();

/**
 * Track and check login brute force attempts per IP
 * Allows up to 5 failed attempts in 10 minutes before a 15-minute lock.
 */
export function checkLoginBruteForce(ip: string): { isBlocked: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = ipRateLimits.get(ip);

  if (record && record.blockedUntil && record.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { isBlocked: true, retryAfterSeconds };
  }

  return { isBlocked: false };
}

export function recordFailedLogin(ip: string): { isNowBlocked: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = ipRateLimits.get(ip) || { count: 0, lastAttempt: now };

  // Reset count if last attempt was over 10 minutes ago
  if (now - record.lastAttempt > 10 * 60 * 1000) {
    record.count = 0;
  }

  record.count += 1;
  record.lastAttempt = now;

  if (record.count >= 5) {
    record.blockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
    ipRateLimits.set(ip, record);
    return { isNowBlocked: true, retryAfterSeconds: 15 * 60 };
  }

  ipRateLimits.set(ip, record);
  return { isNowBlocked: false };
}

export function resetLoginAttempts(ip: string) {
  ipRateLimits.delete(ip);
}

/**
 * Sanitize user input string against HTML injection and script tags
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}
