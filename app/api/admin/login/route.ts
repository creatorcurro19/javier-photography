import { NextResponse } from "next/server";
import {
  verifyCredentials,
  generateSessionToken,
  getAdminUser,
  isSameOriginRequest,
} from "@/lib/server/admin-auth";
import { getClientIp, rateLimit } from "@/lib/server/rate-limit";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;

export async function POST(request: Request) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json(
        { ok: false, error: "Origen de solicitud no permitido." },
        { status: 403, headers: NO_STORE_HEADERS }
      );
    }

    const ip = getClientIp(request);
    // Límite por IP (8 intentos cada 15 min) y límite global contra ataques distribuidos
    const rl = rateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000);
    const globalRl = rateLimit("admin-login:global", 40, 15 * 60 * 1000);
    if (!rl.ok || !globalRl.ok) {
      const retryAfter = Math.max(rl.retryAfter || 0, globalRl.retryAfter || 0);
      return NextResponse.json(
        {
          ok: false,
          error: `Demasiados intentos fallidos. Por seguridad, espera ${retryAfter} segundos antes de reintentar.`,
        },
        {
          status: 429,
          headers: { ...NO_STORE_HEADERS, "Retry-After": String(retryAfter) },
        }
      );
    }

    const body = await request.json().catch(() => null);
    const userCandidate = typeof body?.username === "string" ? body.username.trim() : "";
    const pinCandidate = typeof body?.pin === "string" ? body.pin.trim() : "";

    if (!userCandidate || !pinCandidate) {
      return NextResponse.json(
        { ok: false, error: "Introduce tu usuario y la clave de acceso." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const isValid = verifyCredentials(userCandidate, pinCandidate);
    if (!isValid) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return NextResponse.json(
        {
          ok: false,
          error: "Clave de acceso o usuario no válidos. Verifica la credencial.",
        },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const token = generateSessionToken();
    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json(
      {
        ok: true,
        user: getAdminUser(),
        message: "Acceso concedido al Estudio de Autor",
      },
      { headers: NO_STORE_HEADERS }
    );

    // Cookie HTTP-only segura y persistente por 30 días (nunca expuesta en JS/localStorage)
    response.cookies.set({
      name: "admin_session",
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[admin-login] Error en autenticación:", error);
    return NextResponse.json(
      { ok: false, error: "Error en el servidor al verificar las credenciales." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
