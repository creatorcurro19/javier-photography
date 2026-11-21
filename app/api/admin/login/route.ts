import { NextResponse } from "next/server";
import {
  verifyCredentials,
  generateSessionToken,
} from "@/lib/server/admin-auth";
import { getClientIp, rateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Límite de 10 intentos cada 15 minutos para evitar ataques de fuerza bruta
    const rl = rateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Demasiados intentos fallidos. Por seguridad, espera ${rl.retryAfter} segundos antes de reintentar.`,
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await request.json().catch(() => null);
    const userCandidate = typeof body?.username === "string" ? body.username.trim() : "";
    const pinCandidate = typeof body?.pin === "string" ? body.pin.trim() : "";

    if (!pinCandidate) {
      return NextResponse.json(
        { ok: false, error: "Introduce la clave de acceso de 5 dígitos." },
        { status: 400 }
      );
    }

    const isValid = verifyCredentials(userCandidate, pinCandidate);
    if (!isValid) {
      return NextResponse.json(
        {
          ok: false,
          error: "Clave de acceso o usuario no válidos. Verifica la credencial.",
        },
        { status: 401 }
      );
    }

    const token = generateSessionToken();
    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json({
      ok: true,
      user: "Admin",
      message: "Acceso concedido al Estudio de Autor",
      token, // Devuelto también para clientes que usen Authorization Bearer
    });

    // Establecer cookie HTTP-only segura y persistente por 30 días
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
      { status: 500 }
    );
  }
}
