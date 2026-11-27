const LEGACY_TOKEN_KEY = "je_admin_token";

export function clearLegacyAdminToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  } catch {
    // ignore storage access issues
  }
}

export function getAdminAuthHeaders(extra?: Record<string, string>): Record<string, string> {
  clearLegacyAdminToken();
  return { ...(extra ?? {}) };
}
