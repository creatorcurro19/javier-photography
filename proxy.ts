import { NextResponse } from "next/server";

/**
 * Intercepta y bloquea en borde únicamente rutas de escaneo automático y exposición común
 * (WordPress, PHP, archivos .env/.git, backups). No se ejecuta en ninguna página o API legítima.
 */
export function proxy() {
  return new NextResponse("Forbidden", {
    status: 403,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

export const config = {
  matcher: [
    "/wp-admin",
    "/wp-admin/:path*",
    "/wp-content",
    "/wp-content/:path*",
    "/wp-includes",
    "/wp-includes/:path*",
    "/phpmyadmin",
    "/phpmyadmin/:path*",
    "/cgi-bin",
    "/cgi-bin/:path*",
    "/(\\.env.*)",
    "/(\\.git.*)",
    "/(.*\\.php)",
    "/(.*\\.asp)",
    "/(.*\\.aspx)",
    "/(.*\\.jsp)",
    "/(.*\\.sql)",
    "/(.*\\.bak)",
  ],
};
