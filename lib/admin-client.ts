export function getAdminAuthHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...(extra ?? {}) };
  if (typeof window !== "undefined") {
    try {
      const token = window.localStorage.getItem("je_admin_token");
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore storage access issues
    }
  }
  return headers;
}
