import "server-only";
import crypto from "crypto";

const DEFAULT_PIN = "88722";
const DEFAULT_USER = "Javier";
const DEFAULT_SECRET = "javier-espinosa-studio-auth-secret-key-2026";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 días
const TOKEN_PREFIX = "je_admin_v2";
const SESSION_TOKEN_RE = /^je_admin_v2\.(\d{10,16})\.([a-f0-9]{32})\.([a-f0-9]{64})$/;

// Nonces revocados explícitamente en /api/admin/logout (limpieza perezosa al expirar).
const revokedNonces = new Map<string, number>();

export function getAdminPin(): string {
  return process.env.ADMIN_PIN?.trim() || DEFAULT_PIN;
}

export function getAdminUser(): string {
  return process.env.ADMIN_USER?.trim() || DEFAULT_USER;
}

export function isDefaultPinActive(): boolean {
  return getAdminPin() === DEFAULT_PIN;
}

function getAuthSecret(): string {
  return process.env.AUTH_SECRET?.trim() || DEFAULT_SECRET;
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const digestA = crypto.createHash("sha256").update(a, "utf8").digest();
  const digestB = crypto.createHash("sha256").update(b, "utf8").digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

function computePinBinding(): string {
  return crypto.createHash("sha256").update(getAdminPin(), "utf8").digest("hex").slice(0, 16);
}

function signSessionPayload(expMs: string, nonceHex: string): string {
  return crypto
    .createHmac("sha256", getAuthSecret())
    .update(`${TOKEN_PREFIX}:${expMs}:${nonceHex}:${computePinBinding()}`)
    .digest("hex");
}

function pruneRevokedNonces(now: number): void {
  if (revokedNonces.size < 128) return;
  for (const [nonce, exp] of revokedNonces.entries()) {
    if (exp <= now) {
      revokedNonces.delete(nonce);
    }
  }
}

export function generateSessionToken(): string {
  const expMs = String(Date.now() + SESSION_TTL_MS);
  const nonceHex = crypto.randomBytes(16).toString("hex");
  const signature = signSessionPayload(expMs, nonceHex);
  return `${TOKEN_PREFIX}.${expMs}.${nonceHex}.${signature}`;
}

export function extractSessionToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1].trim());
  } catch {
    return match[1].trim();
  }
}

export function revokeSessionToken(token: string | null | undefined): void {
  if (!token || typeof token !== "string") return;
  const parsed = token.trim().match(SESSION_TOKEN_RE);
  if (!parsed) return;
  const expMs = Number(parsed[1]);
  const nonceHex = parsed[2];
  const signature = parsed[3];
  if (!Number.isFinite(expMs)) return;

  const expected = signSessionPayload(parsed[1], nonceHex);
  if (!timingSafeEqualStrings(signature, expected)) return;

  const now = Date.now();
  pruneRevokedNonces(now);
  if (expMs > now) {
    revokedNonces.set(nonceHex, expMs);
  }
}

export function isValidSessionToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  const parsed = token.trim().match(SESSION_TOKEN_RE);
  if (!parsed) return false;

  const [, expStr, nonceHex, providedSig] = parsed;
  const expMs = Number(expStr);
  const now = Date.now();

  if (!Number.isFinite(expMs) || expMs <= now || expMs > now + SESSION_TTL_MS + 60_000) {
    return false;
  }

  const revokedUntil = revokedNonces.get(nonceHex);
  if (revokedUntil && revokedUntil > now) {
    return false;
  }

  const expectedSig = signSessionPayload(expStr, nonceHex);
  return timingSafeEqualStrings(providedSig, expectedSig);
}

function normalizeUser(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function verifyCredentials(
  userCandidate: string | null | undefined,
  pinCandidate: string | null | undefined
): boolean {
  if (!pinCandidate || typeof pinCandidate !== "string") return false;
  if (!userCandidate || typeof userCandidate !== "string") return false;

  const pinOk = timingSafeEqualStrings(pinCandidate.trim(), getAdminPin());
  const userOk = timingSafeEqualStrings(normalizeUser(userCandidate), normalizeUser(getAdminUser()));
  return pinOk && userOk;
}

export function isAuthenticatedRequest(request: Request): boolean {
  return isValidSessionToken(extractSessionToken(request));
}

export function isSameOriginRequest(request: Request): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site")?.toLowerCase().trim();
  if (secFetchSite === "cross-site") {
    return false;
  }

  const expectedHosts = new Set<string>();
  const addHost = (raw: string | null | undefined) => {
    const cleaned = raw?.split(",")[0]?.trim().toLowerCase();
    if (cleaned) expectedHosts.add(cleaned);
  };

  addHost(request.headers.get("x-forwarded-host"));
  addHost(request.headers.get("host"));
  if (process.env.VERCEL_URL) addHost(process.env.VERCEL_URL);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    addHost(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      addHost(new URL(process.env.NEXT_PUBLIC_SITE_URL).host);
    } catch {
      // ignore invalid URL
    }
  }
  try {
    addHost(new URL(request.url).host);
  } catch {
    // ignore relative URL
  }

  const originHeader = request.headers.get("origin")?.trim();
  if (originHeader) {
    if (originHeader === "null") return false;
    try {
      const originHost = new URL(originHeader).host.toLowerCase();
      return expectedHosts.size === 0 ? false : expectedHosts.has(originHost);
    } catch {
      return false;
    }
  }

  const refererHeader = request.headers.get("referer")?.trim();
  if (refererHeader) {
    try {
      const refererHost = new URL(refererHeader).host.toLowerCase();
      return expectedHosts.size === 0 ? true : expectedHosts.has(refererHost);
    } catch {
      return false;
    }
  }

  return true;
}
