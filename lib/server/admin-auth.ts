import "server-only";
import crypto from "crypto";

const DEFAULT_PIN = "88722";
const DEFAULT_USER = "Javier";
const DEFAULT_SECRET = "javier-espinosa-studio-auth-secret-key-2026";

export function getAdminPin(): string {
  return process.env.ADMIN_PIN?.trim() || DEFAULT_PIN;
}

export function getAdminUser(): string {
  return process.env.ADMIN_USER?.trim() || DEFAULT_USER;
}

function getAuthSecret(): string {
  return process.env.AUTH_SECRET?.trim() || DEFAULT_SECRET;
}

/**
 * Genera el token de sesión seguro usando HMAC-SHA256 con el PIN y el secreto.
 */
export function generateSessionToken(): string {
  const pin = getAdminPin();
  const secret = getAuthSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`admin_session_v1:${pin}`)
    .digest("hex");
  return `je_admin_${signature}`;
}

/**
 * Valida un token de sesión comparándolo de manera segura con el esperado.
 */
export function isValidSessionToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") return false;
  const expectedToken = generateSessionToken();
  if (token.length !== expectedToken.length) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, "utf8"),
      Buffer.from(expectedToken, "utf8")
    );
  } catch {
    return false;
  }
}

/**
 * Comprueba si las credenciales coinciden con el usuario (Javier) y la clave de acceso.
 * El usuario no distingue mayúsculas/minúsculas ni tildes ("javier", "JAVIER"...).
 */
function normalizeUser(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function verifyCredentials(
  userCandidate: string | null | undefined,
  pinCandidate: string | null | undefined
): boolean {
  if (!pinCandidate || typeof pinCandidate !== "string") return false;
  if (!userCandidate || typeof userCandidate !== "string") return false;

  if (pinCandidate.trim() !== getAdminPin()) {
    return false;
  }

  return normalizeUser(userCandidate) === normalizeUser(getAdminUser());
}

/**
 * Extrae y valida la sesión desde la cabecera Cookie o Authorization.
 */
export function isAuthenticatedRequest(request: Request): boolean {
  // 1. Comprobar cabecera Cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (match && match[1]) {
    const token = decodeURIComponent(match[1].trim());
    if (isValidSessionToken(token)) {
      return true;
    }
  }

  // 2. Comprobar cabecera Authorization (Bearer <token>)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (isValidSessionToken(token)) {
      return true;
    }
  }

  return false;
}
